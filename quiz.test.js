import { describe, it, expect } from 'vitest';
import fc from 'fast-check';

// ===== Pure quiz logic functions extracted from index.html =====

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
      isCorrect: isCorrect
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

// ===== Property-Based Tests =====

// Feature: vibe-coding-chapter7-interactive, Property 1: Quiz Structure Invariant
describe('Property 1: Quiz Structure Invariant', () => {
  /**
   * **Validates: Requirements 3.1**
   *
   * For any quiz state, the questions array shall always contain exactly 5 questions,
   * and each question shall have exactly 4 options and a correctIndex in the range [0, 3].
   */
  it('questions array has 5 questions, each with 4 options and correctIndex in [0,3]', () => {
    fc.assert(
      fc.property(fc.constant(null), () => {
        expect(questions.length).toBe(5);
        for (const q of questions) {
          expect(q.options.length).toBe(4);
          expect(q.correctIndex).toBeGreaterThanOrEqual(0);
          expect(q.correctIndex).toBeLessThanOrEqual(3);
        }
      }),
      { numRuns: 100 }
    );
  });
});

// Feature: vibe-coding-chapter7-interactive, Property 2: Answer Selection Updates State
describe('Property 2: Answer Selection Updates State', () => {
  /**
   * **Validates: Requirements 3.3**
   *
   * For any question index in [0, 4] and any option index in [0, 3],
   * calling selectAnswer(questionIndex, optionIndex) shall update the
   * corresponding userAnswer's selectedIndex to the given optionIndex.
   */
  it('selectAnswer updates userAnswers[questionIndex].selectedIndex to optionIndex', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 4 }),
        fc.integer({ min: 0, max: 3 }),
        (questionIndex, optionIndex) => {
          const state = createFreshState();
          selectAnswer(state, questionIndex, optionIndex);
          expect(state.userAnswers[questionIndex].selectedIndex).toBe(optionIndex);
        }
      ),
      { numRuns: 100 }
    );
  });
});

// Feature: vibe-coding-chapter7-interactive, Property 3: Incomplete Submission Validation
describe('Property 3: Incomplete Submission Validation', () => {
  /**
   * **Validates: Requirements 3.5**
   *
   * For any set of user answers where at least one question has selectedIndex
   * equal to -1 (unanswered), validateAllAnswered() shall return false.
   */
  it('validateAllAnswered returns false when at least one answer is -1', () => {
    // Generate an array of 5 selectedIndex values where at least one is -1
    const answersArb = fc
      .tuple(
        fc.integer({ min: -1, max: 3 }),
        fc.integer({ min: -1, max: 3 }),
        fc.integer({ min: -1, max: 3 }),
        fc.integer({ min: -1, max: 3 }),
        fc.integer({ min: -1, max: 3 })
      )
      .filter(arr => arr.some(v => v === -1));

    fc.assert(
      fc.property(answersArb, (indices) => {
        const userAnswers = indices.map((sel, i) => ({
          questionId: i + 1,
          selectedIndex: sel
        }));
        expect(validateAllAnswered(userAnswers)).toBe(false);
      }),
      { numRuns: 100 }
    );
  });
});

// Feature: vibe-coding-chapter7-interactive, Property 4: Score Calculation Formula
describe('Property 4: Score Calculation Formula', () => {
  /**
   * **Validates: Requirements 4.1**
   *
   * For any set of 5 user answers, the total score shall equal the count of
   * correct answers multiplied by 20, yielding a value in {0, 20, 40, 60, 80, 100}.
   */
  it('score equals correctCount × 20 and is in {0, 20, 40, 60, 80, 100}', () => {
    // Generate 5 booleans representing correct/incorrect for each question
    const boolsArb = fc.tuple(
      fc.boolean(),
      fc.boolean(),
      fc.boolean(),
      fc.boolean(),
      fc.boolean()
    );

    fc.assert(
      fc.property(boolsArb, (correctFlags) => {
        // Build userAnswers: if correct, use correctIndex; otherwise pick a wrong index
        const userAnswers = correctFlags.map((isCorrect, i) => {
          const correctIdx = questions[i].correctIndex;
          const selectedIndex = isCorrect
            ? correctIdx
            : (correctIdx + 1) % 4; // guaranteed wrong
          return { questionId: questions[i].id, selectedIndex };
        });

        const result = calculateScore(questions, userAnswers);
        const expectedCorrectCount = correctFlags.filter(Boolean).length;
        const expectedScore = expectedCorrectCount * 20;

        expect(result.totalScore).toBe(expectedScore);
        expect([0, 20, 40, 60, 80, 100]).toContain(result.totalScore);
      }),
      { numRuns: 100 }
    );
  });
});

// Feature: vibe-coding-chapter7-interactive, Property 5: Per-Question Correctness Marking
describe('Property 5: Per-Question Correctness Marking', () => {
  /**
   * **Validates: Requirements 4.3**
   *
   * For any quiz result, each answer entry's isCorrect field shall be true
   * if and only if the selectedIndex equals the correctIndex for that question.
   */
  it('isCorrect is true iff selectedIndex === correctIndex', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 3 }),
        fc.integer({ min: 0, max: 3 }),
        (selectedIndex, correctIndex) => {
          const q = { id: 1, text: 'test', options: ['A', 'B', 'C', 'D'], correctIndex };
          const ua = { questionId: 1, selectedIndex };
          const result = calculateScore([q], [ua]);
          const expected = selectedIndex === correctIndex;
          expect(result.answers[0].isCorrect).toBe(expected);
        }
      ),
      { numRuns: 100 }
    );
  });
});

// Feature: vibe-coding-chapter7-interactive, Property 6: Feedback Message Matches Score Range
describe('Property 6: Feedback Message Matches Score Range', () => {
  /**
   * **Validates: Requirements 4.4**
   *
   * For any score in {0, 20, 40, 60, 80, 100}, the feedback message shall
   * correspond to the defined ranges: 100 → "完美", 80-99 → "很棒",
   * 60-79 → "不錯", 0-59 → "再加油".
   */
  it('feedback message contains the correct keyword for the score range', () => {
    const scoreArb = fc.constantFrom(0, 20, 40, 60, 80, 100);

    fc.assert(
      fc.property(scoreArb, (score) => {
        const message = getFeedbackMessage(score);
        if (score === 100) {
          expect(message).toContain('完美');
        } else if (score >= 80) {
          expect(message).toContain('很棒');
        } else if (score >= 60) {
          expect(message).toContain('不錯');
        } else {
          expect(message).toContain('再加油');
        }
      }),
      { numRuns: 100 }
    );
  });
});

// Feature: vibe-coding-chapter7-interactive, Property 7: Quiz Reset Clears State
describe('Property 7: Quiz Reset Clears State', () => {
  /**
   * **Validates: Requirements 4.5**
   *
   * For any quiz state (submitted or not), calling resetQuiz() shall set all
   * userAnswers' selectedIndex to -1, set isSubmitted to false, and set result to null.
   */
  it('resetQuiz clears all userAnswers, isSubmitted, and result', () => {
    // Generate random answered state: 5 selectedIndex values in [0,3]
    const answeredArb = fc.tuple(
      fc.integer({ min: 0, max: 3 }),
      fc.integer({ min: 0, max: 3 }),
      fc.integer({ min: 0, max: 3 }),
      fc.integer({ min: 0, max: 3 }),
      fc.integer({ min: 0, max: 3 })
    );

    fc.assert(
      fc.property(answeredArb, (indices) => {
        const state = createFreshState();
        // Simulate answered state
        for (let i = 0; i < indices.length; i++) {
          state.userAnswers[i].selectedIndex = indices[i];
        }
        state.isSubmitted = true;
        state.result = calculateScore(state.questions, state.userAnswers);

        // Reset
        resetQuiz(state);

        // Verify all fields cleared
        for (const ua of state.userAnswers) {
          expect(ua.selectedIndex).toBe(-1);
        }
        expect(state.isSubmitted).toBe(false);
        expect(state.result).toBeNull();
      }),
      { numRuns: 100 }
    );
  });
});
