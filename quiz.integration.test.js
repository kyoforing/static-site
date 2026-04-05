import { describe, it, expect } from 'vitest';

// ===== Pure quiz logic functions (same as in quiz.test.js / index.html) =====

const questions = [
  {
    id: 1,
    text: '在第七章的主廚故事中，Isabella 與 Vincent 最大的差異是什麼？',
    options: [
      'Isabella 使用更高級的食材',
      'Isabella 在烹飪過程中不斷建立回饋迴路，而 Vincent 只在最後才檢查成品',
      'Vincent 的廚房設備比較老舊',
      'Isabella 有更多年的烹飪經驗'
    ],
    correctIndex: 1
  },
  {
    id: 2,
    text: '根據 Dan Sturtevant 的研究，在高度耦合的程式碼庫中工作的工程師，其離職率是模組化良好的程式碼庫中工程師的幾倍？',
    options: ['3 倍', '5 倍', '9 倍', '12 倍'],
    correctIndex: 2
  },
  {
    id: 3,
    text: 'Anders Ericsson 提出的刻意練習四大支柱，下列何者不包含在內？',
    options: ['專家指導', '快速回饋', '大量重複練習已熟悉的技能', '任務挑戰'],
    correctIndex: 2
  },
  {
    id: 4,
    text: '關於熱情與技能發展的關係，下列敘述何者最符合第七章的觀點？',
    options: [
      '只有天生對程式設計有熱情的人才能成為優秀的開發者',
      '熱情可以培養，內在驅動力讓技術精進成為樂趣而非負擔',
      '技能發展完全取決於工作年資，與熱情無關',
      '熱情會隨著時間自然消退，不需要刻意培養'
    ],
    correctIndex: 1
  },
  {
    id: 5,
    text: 'Erik Meijer 的名言「The best way to predict the future is to implement it.」最能呼應 Vibe Coding 的哪個核心價值觀？',
    options: ['快速回饋', '模組化思維', '擁抱變化', '持續學習'],
    correctIndex: 2
  }
];

function createFreshState() {
  return {
    questions: questions,
    userAnswers: questions.map(q => ({ questionId: q.id, selectedIndex: -1 })),
    isSubmitted: false,
    result: null
  };
}

function selectAnswer(state, questionIndex, optionIndex) {
  state.userAnswers[questionIndex].selectedIndex = optionIndex;
}

function validateAllAnswered(userAnswers) {
  return userAnswers.every(answer => answer.selectedIndex !== -1);
}

function getFeedbackMessage(score) {
  if (score === 100) return '🎉 完美！你完全掌握了第七章的精髓！';
  if (score >= 80) return '👏 很棒！你對這章的理解非常深入！';
  if (score >= 60) return '👍 不錯！但還有一些概念可以再複習。';
  return '💪 再加油！建議重新閱讀章節內容後再試一次。';
}

function calculateScore(questionsArr, userAnswers) {
  let correctCount = 0;
  const answers = [];
  for (let i = 0; i < questionsArr.length; i++) {
    const q = questionsArr[i];
    const ua = userAnswers[i];
    const isCorrect = ua.selectedIndex === q.correctIndex;
    if (isCorrect) correctCount++;
    answers.push({
      questionId: q.id,
      selectedIndex: ua.selectedIndex,
      correctIndex: q.correctIndex,
      isCorrect
    });
  }
  const totalScore = correctCount * 20;
  return {
    totalScore,
    answers,
    feedbackMessage: getFeedbackMessage(totalScore)
  };
}

function resetQuiz(state) {
  for (let i = 0; i < state.userAnswers.length; i++) {
    state.userAnswers[i].selectedIndex = -1;
  }
  state.isSubmitted = false;
  state.result = null;
}

/** Simulate the full submit flow: validate → calculate → update state */
function submitQuiz(state) {
  if (state.isSubmitted) return null; // prevent double submission
  if (!validateAllAnswered(state.userAnswers)) return '請回答所有題目後再提交';
  const result = calculateScore(state.questions, state.userAnswers);
  state.isSubmitted = true;
  state.result = result;
  return result;
}

// ===== Integration Tests =====

// **Validates: Requirements 3.3, 3.4, 3.5, 4.2, 4.5**
describe('Integration: Complete Quiz Flow', () => {
  it('select all answers → submit → verify result → reset → verify clean state', () => {
    const state = createFreshState();

    // Step 1: Select answers for all 5 questions (all correct)
    selectAnswer(state, 0, 1); // correct
    selectAnswer(state, 1, 2); // correct
    selectAnswer(state, 2, 2); // correct
    selectAnswer(state, 3, 1); // correct
    selectAnswer(state, 4, 2); // correct

    // Step 2: Validate all answered
    expect(validateAllAnswered(state.userAnswers)).toBe(true);

    // Step 3: Submit and get result
    const result = submitQuiz(state);
    expect(result).not.toBeNull();
    expect(typeof result).toBe('object');
    expect(result.totalScore).toBe(100);
    expect(result.answers.length).toBe(5);
    expect(result.answers.every(a => a.isCorrect)).toBe(true);
    expect(result.feedbackMessage).toContain('完美');

    // Step 4: Verify state is submitted
    expect(state.isSubmitted).toBe(true);
    expect(state.result).toBe(result);

    // Step 5: Reset quiz
    resetQuiz(state);

    // Step 6: Verify clean state
    expect(state.isSubmitted).toBe(false);
    expect(state.result).toBeNull();
    for (const ua of state.userAnswers) {
      expect(ua.selectedIndex).toBe(-1);
    }
  });

  it('select all answers with mixed correctness → submit → verify partial score', () => {
    const state = createFreshState();

    // Select: 3 correct, 2 wrong
    selectAnswer(state, 0, 1); // correct (correctIndex: 1)
    selectAnswer(state, 1, 0); // wrong   (correctIndex: 2)
    selectAnswer(state, 2, 2); // correct (correctIndex: 2)
    selectAnswer(state, 3, 1); // correct (correctIndex: 1)
    selectAnswer(state, 4, 0); // wrong   (correctIndex: 2)

    expect(validateAllAnswered(state.userAnswers)).toBe(true);

    const result = submitQuiz(state);
    expect(result.totalScore).toBe(60);
    expect(result.feedbackMessage).toContain('不錯');

    // Verify per-question correctness
    expect(result.answers[0].isCorrect).toBe(true);
    expect(result.answers[1].isCorrect).toBe(false);
    expect(result.answers[2].isCorrect).toBe(true);
    expect(result.answers[3].isCorrect).toBe(true);
    expect(result.answers[4].isCorrect).toBe(false);
  });
});

// **Validates: Requirements 3.5**
describe('Integration: Partial Submission Prevention', () => {
  it('selecting some answers → validate returns false → submit returns warning', () => {
    const state = createFreshState();

    // Only answer 3 out of 5 questions
    selectAnswer(state, 0, 1);
    selectAnswer(state, 2, 0);
    selectAnswer(state, 4, 3);

    // Validation should fail
    expect(validateAllAnswered(state.userAnswers)).toBe(false);

    // Submit should return warning message
    const result = submitQuiz(state);
    expect(result).toBe('請回答所有題目後再提交');

    // State should remain unsubmitted
    expect(state.isSubmitted).toBe(false);
    expect(state.result).toBeNull();
  });

  it('answering zero questions → submit returns warning', () => {
    const state = createFreshState();

    expect(validateAllAnswered(state.userAnswers)).toBe(false);

    const result = submitQuiz(state);
    expect(result).toBe('請回答所有題目後再提交');
    expect(state.isSubmitted).toBe(false);
  });
});

// **Validates: Requirements 4.5**
describe('Integration: Reset After Submission', () => {
  it('complete quiz → get result → reset → verify all state cleared → can re-answer', () => {
    const state = createFreshState();

    // Complete and submit (all wrong)
    selectAnswer(state, 0, 0);
    selectAnswer(state, 1, 0);
    selectAnswer(state, 2, 0);
    selectAnswer(state, 3, 0);
    selectAnswer(state, 4, 0);

    const firstResult = submitQuiz(state);
    expect(firstResult.totalScore).toBe(0);
    expect(firstResult.feedbackMessage).toContain('再加油');
    expect(state.isSubmitted).toBe(true);

    // Reset
    resetQuiz(state);

    // Verify clean state
    expect(state.isSubmitted).toBe(false);
    expect(state.result).toBeNull();
    for (const ua of state.userAnswers) {
      expect(ua.selectedIndex).toBe(-1);
    }

    // Re-answer (all correct this time)
    selectAnswer(state, 0, 1);
    selectAnswer(state, 1, 2);
    selectAnswer(state, 2, 2);
    selectAnswer(state, 3, 1);
    selectAnswer(state, 4, 2);

    expect(validateAllAnswered(state.userAnswers)).toBe(true);

    const secondResult = submitQuiz(state);
    expect(secondResult.totalScore).toBe(100);
    expect(secondResult.feedbackMessage).toContain('完美');
    expect(state.isSubmitted).toBe(true);
  });
});

// **Validates: Requirements 3.4**
describe('Integration: Double Submission Prevention', () => {
  it('submit once → try to submit again → second submit returns null, state unchanged', () => {
    const state = createFreshState();

    // Answer all questions
    selectAnswer(state, 0, 1);
    selectAnswer(state, 1, 2);
    selectAnswer(state, 2, 2);
    selectAnswer(state, 3, 1);
    selectAnswer(state, 4, 2);

    // First submission
    const firstResult = submitQuiz(state);
    expect(firstResult).not.toBeNull();
    expect(firstResult.totalScore).toBe(100);

    // Capture state after first submission
    const savedResult = state.result;
    const savedIsSubmitted = state.isSubmitted;

    // Second submission attempt
    const secondResult = submitQuiz(state);
    expect(secondResult).toBeNull();

    // State should be unchanged
    expect(state.isSubmitted).toBe(savedIsSubmitted);
    expect(state.result).toBe(savedResult);
    expect(state.result.totalScore).toBe(100);
  });
});

// **Validates: Requirements 4.2, 4.4**
describe('Integration: Feedback Message for Various Scores', () => {
  it('all correct (100) → 完美 feedback', () => {
    const state = createFreshState();
    selectAnswer(state, 0, 1);
    selectAnswer(state, 1, 2);
    selectAnswer(state, 2, 2);
    selectAnswer(state, 3, 1);
    selectAnswer(state, 4, 2);

    const result = submitQuiz(state);
    expect(result.totalScore).toBe(100);
    expect(result.feedbackMessage).toContain('完美');
  });

  it('4 correct (80) → 很棒 feedback', () => {
    const state = createFreshState();
    selectAnswer(state, 0, 1); // correct
    selectAnswer(state, 1, 2); // correct
    selectAnswer(state, 2, 2); // correct
    selectAnswer(state, 3, 1); // correct
    selectAnswer(state, 4, 0); // wrong

    const result = submitQuiz(state);
    expect(result.totalScore).toBe(80);
    expect(result.feedbackMessage).toContain('很棒');
  });

  it('3 correct (60) → 不錯 feedback', () => {
    const state = createFreshState();
    selectAnswer(state, 0, 1); // correct
    selectAnswer(state, 1, 0); // wrong
    selectAnswer(state, 2, 2); // correct
    selectAnswer(state, 3, 1); // correct
    selectAnswer(state, 4, 0); // wrong

    const result = submitQuiz(state);
    expect(result.totalScore).toBe(60);
    expect(result.feedbackMessage).toContain('不錯');
  });

  it('1 correct (20) → 再加油 feedback', () => {
    const state = createFreshState();
    selectAnswer(state, 0, 1); // correct
    selectAnswer(state, 1, 0); // wrong
    selectAnswer(state, 2, 0); // wrong
    selectAnswer(state, 3, 0); // wrong
    selectAnswer(state, 4, 0); // wrong

    const result = submitQuiz(state);
    expect(result.totalScore).toBe(20);
    expect(result.feedbackMessage).toContain('再加油');
  });

  it('all wrong (0) → 再加油 feedback', () => {
    const state = createFreshState();
    selectAnswer(state, 0, 0); // wrong
    selectAnswer(state, 1, 0); // wrong
    selectAnswer(state, 2, 0); // wrong
    selectAnswer(state, 3, 0); // wrong
    selectAnswer(state, 4, 0); // wrong

    const result = submitQuiz(state);
    expect(result.totalScore).toBe(0);
    expect(result.feedbackMessage).toContain('再加油');
  });
});
