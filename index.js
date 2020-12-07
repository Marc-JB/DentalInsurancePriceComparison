const careAllowance = 1287_00

/**
 * @typedef {(costsForCheckups: number, costsForCare: number) => number} DentalCarePaidByInsuranceCalculator
 * @typedef {{name: string, yearlyCosts: number, insurancePays: DentalCarePaidByInsuranceCalculator}} InsuranceSpecification
 */

/**
 * @type {DentalCarePaidByInsuranceCalculator}
 */
const insurancePaysNothing = (costsForCheckups, costsForCare) => 0

/**
 * @type {DentalCarePaidByInsuranceCalculator}
 */
const insurancePays75PercentUntil250 = (costsForCheckups, costsForCare) => {
    const tmp = (costsForCheckups + costsForCare) * 0.75
    return tmp > 250_00 ? 250_00 : Math.round(tmp)
}

/**
 * @type {DentalCarePaidByInsuranceCalculator}
 */
const insurancePays75PercentAndCheckupsUntil250 = (costsForCheckups, costsForCare) => {
    const tmp = costsForCheckups + (costsForCare * 0.75)
    return tmp > 250_00 ? 250_00 : Math.round(tmp)
}

/**
 * @type {DentalCarePaidByInsuranceCalculator}
 */
const insurancePaysUntil250 = (costsForCheckups, costsForCare) => {
    const tmp = costsForCheckups + costsForCare
    return tmp > 250_00 ? 250_00 : Math.round(tmp)
}

/**
 * @type {InsuranceSpecification[]}
 */
const insurances = [
    {
        name: "ZieZo",
        yearlyCosts: 1087_08,
        insurancePays: insurancePaysNothing
    }, {
        name: "Just",
        yearlyCosts: 1113_72,
        insurancePays: insurancePaysNothing
    }, {
        name: "Bewuzt",
        yearlyCosts: 1126_80,
        insurancePays: insurancePaysNothing
    }, {
        name: "Stud.G.V.",
        yearlyCosts: 1148_76,
        insurancePays: insurancePaysNothing
    }, {
        name: "CZ Direct",
        yearlyCosts: 1151_88,
        insurancePays: insurancePaysNothing
    }, {
        name: "Just 🦷",
        yearlyCosts: 1190_16,
        insurancePays: insurancePays75PercentUntil250
    }, {
        name: "ZieZo 🦷",
        yearlyCosts: 1214_76,
        insurancePays: insurancePays75PercentAndCheckupsUntil250
    }, {
        name: "CZ Direct 🦷",
        yearlyCosts: 1228_32,
        insurancePays: insurancePays75PercentUntil250
    }, {
        name: "Bewuzt 🦷",
        yearlyCosts: 1250_40,
        insurancePays: insurancePays75PercentAndCheckupsUntil250
    }, {
        name: "Stud.G.V. 🦷",
        yearlyCosts: 1276_08,
        insurancePays: insurancePaysUntil250
    }
]

/**
 * @param {InsuranceSpecification} insurance 
 * @param {number} checkUpCosts 
 * @param {number} dentalCareCosts 
 */
function calculateYearlyCostsInCents(insurance, checkUpCosts, dentalCareCosts) {
    const dentalCostsTotal = checkUpCosts + dentalCareCosts
    const dentalCostsPaidByInsurance = insurance.insurancePays(checkUpCosts, dentalCareCosts)
    const consumerDentalCosts = dentalCostsTotal - dentalCostsPaidByInsurance
    return consumerDentalCosts + insurance.yearlyCosts - careAllowance
}

// @ts-ignore
const allArgs = process.argv
/** 
 * @type {string[]}
 */
const args = allArgs.slice(2)
const included = args[0] === "--include" || args[0] === "-i" ? args[2] === "--dental" || args[2] === "-d" ? args[1] + " 🦷" : args[1] : null

const costsForInsurance = []
const checkUpConstsOnce = 22_50
for(let checkUpCosts = checkUpConstsOnce * 2; checkUpCosts <= checkUpConstsOnce * 2; checkUpCosts += checkUpConstsOnce) {
    for(let dentalCareCosts = 0; dentalCareCosts <= 320_00; dentalCareCosts += 10_00) {
        const obj = { 
            checkups: checkUpCosts / checkUpConstsOnce, 
            additional: dentalCareCosts / 100
        }
        /**
         * @param {InsuranceSpecification} insurance 
         */
        function checkPrice(insurance) {
            return calculateYearlyCostsInCents(insurance, checkUpCosts, dentalCareCosts)
        }
        const sorted = insurances.sort((a, b) => checkPrice(a) - checkPrice(b))
        const first = sorted[0]
        obj["1st"] = first.name
        obj["1st (€)"] = checkPrice(first) / 100
        const second = sorted[1]
        obj["2nd"] = second.name
        obj["2nd (€)"] = checkPrice(second) / 100
        obj["2nd (diff)"] = (checkPrice(second) - checkPrice(first)) / 100
        const customThird = included !== null && first.name !== included && second.name !== included
        const third = customThird ? sorted.find(it => it.name === included) ?? sorted[2] : sorted[2]
        obj["3rd"] = third.name
        obj["3rd (€)"] = checkPrice(third) / 100
        obj["3rd (diff)"] = (checkPrice(third) - checkPrice(first)) / 100
        costsForInsurance.push(obj)
    }
}
console.table(costsForInsurance)
