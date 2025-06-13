// AI Mock Service
const AIService = {
  getRecommendations: (accountInfo) => {
    const recommendations = {
      'Medicare': [
        'Verify MSP status before processing',
        'Check for coordination of benefits',
        'Review LCD/NCD policies for service'
      ],
      'Medicaid': [
        'Verify eligibility on date of service',
        'Check state-specific requirements',
        'Review prior authorization status'
      ],
      'Blue Cross': [
        'Verify network status',
        'Check contract terms for service',
        'Review authorization requirements'
      ]
    };

    return recommendations[accountInfo?.insuranceType] || ['Contact insurance for clarification'];
  },

  analyzeDocument: (docType) => {
    const analyses = {
      'EOB': {
        findings: ['Payment amount: $850.00', 'Denial reason: CO-50 - Service not covered'],
        recommendations: ['Appeal denial with medical necessity documentation', 'Check for secondary coverage'],
        nextActions: ['Submit appeal within 60 days', 'Request medical records']
      },
      'UB04': {
        findings: ['Missing modifier on line 2', 'Incorrect condition code in FL 18'],
        recommendations: ['Add modifier 59 to line 2', 'Correct condition code from 01 to 02'],
        nextActions: ['Submit corrected claim', 'Recalculate total charges']
      }
    };

    return analyses[docType] || {
      findings: ['Document processed successfully'],
      recommendations: ['Review document for relevant information'],
      nextActions: ['Take appropriate follow-up action']
    };
  }
};

export default AIService;
