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

// ===== Unit Tests =====

// **Validates: Requirements 3.1, 3.2**
describe('Quiz Structure', () => {
  it('should have exactly 5 questions', () => {
    expect(questions.length).toBe(5);
  });

  it('each question should have exactly 4 options', () => {
    for (const q of questions) {
      expect(q.options.length).toBe(4);
    }
  });

  it('each question should have a valid correctIndex (0-3)', () => {
    for (const q of questions) {
      expect(q.correctIndex).toBeGreaterThanOrEqual(0);
      expect(q.correctIndex).toBeLessThanOrEqual(3);
    }
  });

  it('each question should have non-empty text', () => {
    for (const q of questions) {
      expect(q.text.length).toBeGreaterThan(0);
    }
  });

  it('each question should have non-empty options', () => {
    for (const q of questions) {
      for (const opt of q.options) {
        expect(opt.length).toBeGreaterThan(0);
      }
    }
  });
});

// **Validates: Requirements 4.1**
describe('Score Calculation Boundary Conditions', () => {
  it('all correct answers should yield 100 points', () => {
    const userAnswers = questions.map(q => ({
      questionId: q.id,
      selectedIndex: q.correctIndex
    }));
    const result = calculateScore(questions, userAnswers);
    expect(result.totalScore).toBe(100);
  });

  it('all wrong answers should yield 0 points', () => {
    const userAnswers = questions.map(q => ({
      questionId: q.id,
      selectedIndex: (q.correctIndex + 1) % 4
    }));
    const result = calculateScore(questions, userAnswers);
    expect(result.totalScore).toBe(0);
  });

  it('3 correct answers should yield 60 points', () => {
    const userAnswers = questions.map((q, i) => ({
      questionId: q.id,
      selectedIndex: i < 3 ? q.correctIndex : (q.correctIndex + 1) % 4
    }));
    const result = calculateScore(questions, userAnswers);
    expect(result.totalScore).toBe(60);
  });
});

// **Validates: Requirements 3.5**
describe('Submit Validation Logic', () => {
  it('validateAllAnswered returns true when all questions are answered', () => {
    const userAnswers = questions.map(q => ({
      questionId: q.id,
      selectedIndex: 0
    }));
    expect(validateAllAnswered(userAnswers)).toBe(true);
  });

  it('validateAllAnswered returns false when no questions are answered', () => {
    const userAnswers = questions.map(q => ({
      questionId: q.id,
      selectedIndex: -1
    }));
    expect(validateAllAnswered(userAnswers)).toBe(false);
  });

  it('incomplete answers should not produce a valid score submission', () => {
    const userAnswers = [
      { questionId: 1, selectedIndex: 0 },
      { questionId: 2, selectedIndex: -1 },
      { questionId: 3, selectedIndex: 2 },
      { questionId: 4, selectedIndex: 1 },
      { questionId: 5, selectedIndex: 3 }
    ];
    expect(validateAllAnswered(userAnswers)).toBe(false);
  });
});
