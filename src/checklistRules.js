class ChecklistRule {
    constructor(id, name, evaluator, description) {
        this.id = id;
        this.name = name;
        this.evaluator = evaluator;
        this.description = description;
    }

    evaluate(data) {
        const result = this.evaluator(data);
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            passed: result.passed,
            message: result.message,
            details: result.details || {}
        };
    }
}

const rules = [
    new ChecklistRule(
        'valuationFeePaid',
        'Valuation Fee Paid',
        (data) => ({
            passed: data.isValuationFeePaid === true,
            message: data.isValuationFeePaid ? 
                'Valuation fee has been paid' : 
                'Valuation fee payment is required'
        }),
        'Checks if the valuation fee has been paid'
    ),
    
    new ChecklistRule(
        'ukResident',
        'UK Resident',
        (data) => ({
            passed: data.isUkResident === true,
            message: data.isUkResident ?
                'Applicant is a UK resident' :
                'Applicant must be a UK resident'
        }),
        'Verifies UK residency status'
    ),
    
    new ChecklistRule(
        'riskRating',
        'Risk Rating Check',
        (data) => ({
            passed: data.riskRating === "Medium",
            message: data.riskRating === "Medium" ?
                'Risk rating is Medium' :
                `Risk rating is ${data.riskRating}, requires Medium`,
            details: { currentRating: data.riskRating }
        }),
        'Validates that risk rating is Medium'
    ),
    
    new ChecklistRule(
        'ltvCheck',
        'LTV Below 60%',
        (data) => {
            const ltv = (data.loanRequired / data.purchasePrice) * 100;
            return {
                passed: ltv < 60,
                message: `LTV is ${ltv.toFixed(2)}% (${ltv < 60 ? 'below' : 'above'} 60% threshold)`,
                details: {
                    calculatedLTV: ltv,
                    loanRequired: data.loanRequired,
                    purchasePrice: data.purchasePrice
                }
            };
        },
        'Checks if Loan-to-Value ratio is below 60%'
    )
];

function evaluateChecklist(data) {
    if (!data) {
        throw new Error('No data provided for evaluation');
    }
    
    return rules.map(rule => rule.evaluate(data));
}

module.exports = { evaluateChecklist };
