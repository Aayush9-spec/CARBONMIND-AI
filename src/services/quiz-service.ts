// =============================================================================
// CARBONMIND AI — Quiz & Education Service
// =============================================================================
/**
 * @file QuizService.ts
 * @description Serves educational modules and grades the interactive Carbon Literacy Quiz.
 */

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface EducationalModule {
  id: string;
  title: string;
  category: string;
  description: string;
  content: string;
  readTime: string;
}

export class QuizService {
  /**
   * Fetch all literacy quiz questions.
   */
  getQuizQuestions(): QuizQuestion[] {
    return [
      {
        id: 'q1',
        question: 'Which sector contributes the most to greenhouse gas emissions globally?',
        options: [
          'Agriculture and Forestry',
          'Electricity and Heat Production',
          'Transportation',
          'Manufacturing and Industry'
        ],
        correctAnswerIndex: 1,
        explanation: 'Electricity and heat production represents ~25% of global emissions due to high reliance on coal and natural gas power plants.'
      },
      {
        id: 'q2',
        question: 'What is a "Smart Grid" peak hour optimization?',
        options: [
          'Using electricity during maximum sun/wind production intervals',
          'Charging cars only during morning traffic hours',
          'Running heating systems at highest temperatures',
          'Shutting down power entirely on weekends'
        ],
        correctAnswerIndex: 0,
        explanation: 'Smart grids incentivize running heavy loads (like washing machines or EV charging) when clean solar and wind resources are actively generating.'
      },
      {
        id: 'q3',
        question: 'How much carbon footprint is saved on average by switching one meal to plant-based options?',
        options: [
          'Less than 0.1 kg CO₂e',
          'Approx. 1.5 - 2.5 kg CO₂e',
          'More than 15.0 kg CO₂e',
          'Zero CO₂e is saved'
        ],
        correctAnswerIndex: 1,
        explanation: 'Transitioning from beef or pork to beans, lentils, or grains eliminates highly intensive agricultural supply chain footprints, saving 1.5 - 2.5 kg CO₂e per meal.'
      },
      {
        id: 'q4',
        question: 'What is the purpose of carbon credit offset registries?',
        options: [
          'To increase corporate energy consumption',
          'To verify and ledger carbon reduction or removal programs',
          'To tax retail transactions',
          'To distribute free flight vouchers'
        ],
        correctAnswerIndex: 1,
        explanation: 'Registries ensure carbon removal initiatives (nature-based reforestation, ocean sinks) are validated, preventing double-counting of carbon credits.'
      }
    ];
  }

  /**
   * Fetch structured educational sustainability modules.
   */
  getEducationalModules(): EducationalModule[] {
    return [
      {
        id: 'mod1',
        title: 'Carbon DNA Foundations',
        category: 'Awareness',
        description: 'Understand the core categories that form your personal climate ledger.',
        content: 'Your Carbon DNA maps transportation (fuel type), diet (meat vs plant), energy (utility grid load), and shopping (consumption lifecycle) into equivalent greenhouse gas units (CO₂e). Tracking these provides a quantitative baseline for reduction.',
        readTime: '3 min read'
      },
      {
        id: 'mod2',
        title: 'Decarbonizing Transportation',
        category: 'Reduction',
        description: 'Learn simple ways to swap combustion trips for green transit.',
        content: 'Replacing solo gasoline drives with electric rail or walking eliminates high carbon tailpipe emissions. Even swapping a hybrid drive for active walking saves 0.21kg CO₂e per kilometer.',
        readTime: '4 min read'
      },
      {
        id: 'mod3',
        title: 'Smart Energy Loading',
        category: 'Understanding',
        description: 'Sync home electronics with clean energy grid intervals.',
        content: 'Grid emissions vary hourly. Standard utilities burn coal or gas during high demand intervals. Activating appliances during Peak Solar hours reduces direct grid load stress and overall emissions.',
        readTime: '5 min read'
      }
    ];
  }

  /**
   * Evaluate a user's quiz answers.
   * @param answers Array of selected option indices.
   * @returns Percentage score and grade report.
   */
  gradeQuiz(answers: number[]): { score: number; passed: boolean; feedback: string } {
    const questions = this.getQuizQuestions();
    let correctCount = 0;

    questions.forEach((q, idx) => {
      if (answers[idx] === q.correctAnswerIndex) {
        correctCount++;
      }
    });

    const score = Math.round((correctCount / questions.length) * 100);
    const passed = score >= 75;
    
    return {
      score,
      passed,
      feedback: passed 
        ? 'Excellent! You have demonstrated strong climate awareness and carbon literacy.'
        : 'Good effort! Review the educational modules to improve your understanding of smart grids and carbon tracking.'
    };
  }
}
