const calculationType = {
  nonOilS: {
    // ? S = sector
    incomeTax: {
      limit: 8000,
      rate: 0.14,
    },
    empPensionFund: {
      limit: 200,
      plus: 6,
      firstRate: 0.03,
      secondRate: 0.1,
    },
    empUnemploymentIns: {
      rate: 0.005,
    },
    empMedicalIns: {
      limit: 8000,
      plus: 160,
      firstRate: 0.02,
      secondRate: 0.005,
    },
    pensionFund: {
      limit: 200,
      plus: 44,
      firstRate: 0.22,
      secondRate: 0.15,
    },
    unemploymentIns: {
      rate: 0.005,
    },
    medicalIns: {
      limit: 8000,
      plus: 160,
      firstRate: 0.02,
      secondRate: 0.005,
    },
  },
  oilS: {
    incomeTax: {
      taxFree: 200,
      limit: 2500,
      plus: 350,
      firstRate: 0.14,
      secondRate: 0.25,
    },
    empPensionFund: {
      rate: 0.03,
    },
    empUnemploymentIns: {
      rate: 0.005,
    },
    empMedicalIns: {
      limit: 8000,
      plus: 160,
      firstRate: 0.02,
      secondRate: 0.005,
    },
  },
};

class SalaryCalculator {
  constructor({ fullname, fin, position, gross, work_hours, actual_hours }, calcType = "nonOilS") {
    this.fullname = fullname;
    this.fin = fin;
    this.position = position;
    this.gross = gross;
    this.work_hours = work_hours;
    this.actual_hours = actual_hours;
    this.totalTax = 0;
    this.calcType = calcType;
    this.calculationType = calculationType[calcType];
  }

  getIncomeTax() {
    const { incomeTax } = this.calculationType;
    let tax = 0;
    if (this.calcType === "nonOilS") {
      tax = this.gross <= incomeTax.limit ? 0 : (this.gross - incomeTax.limit) * incomeTax.rate;
    } else if (this.calcType === "oilS") {
      tax =
        this.gross < incomeTax.taxFree
          ? 0
          : this.gross < incomeTax.limit
          ? (this.gross - incomeTax.taxFree) * incomeTax.firstRate
          : (this.gross - incomeTax.limit) * incomeTax.secondRate + incomeTax.plus;
    }
    this.totalTax += tax;
    return Number(tax.toFixed(2));
  }

  getEmpPensionFund() {
    const { empPensionFund } = this.calculationType;
    let tax = 0;
    if (this.calcType === "nonOilS") {
      tax =
        this.gross <= empPensionFund.limit
          ? this.gross * empPensionFund.firstRate
          : (this.gross - empPensionFund.limit) * empPensionFund.secondRate + empPensionFund.plus;
    } else tax = this.gross * empPensionFund.rate;
    this.totalTax += tax;
    return Number(tax.toFixed(2));
  }

  getEmpUnemploymentIns() {
    const { empUnemploymentIns } = this.calculationType;
    const tax = this.gross * empUnemploymentIns.rate;
    this.totalTax += tax;
    return Number(tax.toFixed(2));
  }

  getEmpMedicalIns() {
    const { empMedicalIns } = this.calculationType;
    const tax =
      this.gross <= empMedicalIns.limit
        ? this.gross * empMedicalIns.firstRate
        : (this.gross - empMedicalIns.limit) * empMedicalIns.secondRate + empMedicalIns.plus;
    this.totalTax += tax;
    return Number(tax.toFixed(2));
  }

  getPensionFund() {
    const { pensionFund } = this.calculationType;
    const tax =
      this.gross <= pensionFund.limit
        ? this.gross * pensionFund.firstRate
        : (this.gross - pensionFund.limit) * pensionFund.secondRate + pensionFund.plus;
    return Number(tax.toFixed(2));
  }

  getUnemploymentIns() {
    const { unemploymentIns } = this.calculationType;
    const tax = this.gross * unemploymentIns.rate;
    return Number(tax.toFixed(2));
  }

  getMedicalIns() {
    const { medicalIns } = this.calculationType;
    const tax =
      this.gross <= medicalIns.limit
        ? this.gross * medicalIns.firstRate
        : (this.gross - medicalIns.limit) * medicalIns.secondRate + medicalIns.plus;
    return Number(tax.toFixed(2));
  }

  getCalculatedData() {
    return {
      fullname: this.fullname,
      fin: this.fin,
      position: this.position,
      work_hours: this.work_hours,
      actual_hours: this.actual_hours,
      gross: this.gross,
      income_tax: this.getIncomeTax(),
      emp_pension_fund: this.getEmpPensionFund(),
      emp_unemployment_insurance: this.getEmpUnemploymentIns(),
      emp_medical_insurance: this.getEmpMedicalIns(),
      ...(this.calcType === "nonOilS" && {
        pension_fund: this.getPensionFund(),
        unemployment_insurance: this.getUnemploymentIns(),
        medical_insurance: this.getMedicalIns(),
      }),
      totalTax: Number(this.totalTax.toFixed(2)),
      nett: Number((this.gross - this.totalTax).toFixed(2)),
    };
  }
}

module.exports = {
  SalaryCalculator,
}
