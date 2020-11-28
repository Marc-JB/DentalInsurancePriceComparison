const insurancePaysNothing = (costsForCheckups, costsForCare) => 0

const insurancePays75PercentUntil250 = (costsForCheckups, costsForCare) => {
    const tmp = (costsForCheckups + costsForCare) * 0.75
    return tmp > 250_00 ? 250_00 : Math.round(tmp)
}

const insurancePays75PercentAndCheckupsUntil250 = (costsForCheckups, costsForCare) => {
    const tmp = costsForCheckups + (costsForCare * 0.75)
    return tmp > 250_00 ? 250_00 : Math.round(tmp)
}

const insurancePaysUntil250 = (costsForCheckups, costsForCare) => {
    const tmp = costsForCheckups + costsForCare
    return tmp > 250_00 ? 250_00 : Math.round(tmp)
}

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

let minimalPay = insurances[0].yearlyCosts
for (const insurance of insurances) {
    if(insurance.yearlyCosts < minimalPay) {
        minimalPay = insurance.yearlyCosts
    }
}

function calculateYearlyCostsInCents(insurance, checkUpCosts, dentalCareCosts) {
    const dentalCostsTotal = checkUpCosts + dentalCareCosts
    const dentalCostsPaidByInsurance = insurance.insurancePays(checkUpCosts, dentalCareCosts)
    const consumerDentalCosts = dentalCostsTotal - dentalCostsPaidByInsurance
    return consumerDentalCosts + insurance.yearlyCosts - minimalPay
}

const costsForInsurance = []
const checkUpConstsOnce = 22_50
for(let checkUpCosts = checkUpConstsOnce * 2; checkUpCosts <= checkUpConstsOnce * 2; checkUpCosts += checkUpConstsOnce) {
    for(let dentalCareCosts = 0; dentalCareCosts <= 260_00; dentalCareCosts += 5_00) {
        const obj = { 
            checkups: checkUpCosts / checkUpConstsOnce, 
            additional: dentalCareCosts / 100
        }
        function checkPrice(insurance) {
            return calculateYearlyCostsInCents(insurance, checkUpCosts, dentalCareCosts)
        }
        const sorted = insurances.sort((a, b) => checkPrice(a) - checkPrice(b))
        obj["1st"] = sorted[0].name
        obj["1st (€)"] = checkPrice(sorted[0]) / 100
        obj["2nd"] = sorted[1].name
        obj["2nd (€)"] = checkPrice(sorted[1]) / 100
        obj["2nd (diff)"] = (checkPrice(sorted[1]) - checkPrice(sorted[0])) / 100
        obj["3rd"] = sorted[2].name
        obj["3rd (€)"] = checkPrice(sorted[2]) / 100
        obj["3rd (diff)"] = (checkPrice(sorted[2]) - checkPrice(sorted[0])) / 100
        costsForInsurance.push(obj)
    }
}
console.table(costsForInsurance)
