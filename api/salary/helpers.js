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
  constructor({ id, fullname, fin, department, position, j_start_date, gross, work_hours, actual_hours, working_days, group }, calcType = "nonOilS") {
    this.id = id;
    this.group = group;
    this.fullname = fullname;
    this.fin = fin;
    this.position = position;
    this.department = department;
    this.joinDate = j_start_date
    this.gross = gross;
    this.work_hours = work_hours;
    this.actual_hours = actual_hours;
    this.empTotalTax = 0;
    this.totalTax = 0;
    this.working_days = working_days
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
    this.empTotalTax += tax;
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
    this.empTotalTax += tax;
    return Number(tax.toFixed(2));
  }

  getEmpUnemploymentIns() {
    const { empUnemploymentIns } = this.calculationType;
    const tax = this.gross * empUnemploymentIns.rate;
    this.empTotalTax += tax;
    return Number(tax.toFixed(2));
  }

  getEmpMedicalIns() {
    const { empMedicalIns } = this.calculationType;
    const tax =
      this.gross <= empMedicalIns.limit
        ? this.gross * empMedicalIns.firstRate
        : (this.gross - empMedicalIns.limit) * empMedicalIns.secondRate + empMedicalIns.plus;
    this.empTotalTax += tax;
    return Number(tax.toFixed(2));
  }

  getPensionFund() {
    const { pensionFund } = this.calculationType;
    const tax =
      this.gross <= pensionFund.limit
        ? this.gross * pensionFund.firstRate
        : (this.gross - pensionFund.limit) * pensionFund.secondRate + pensionFund.plus;
    this.totalTax += tax;
    return Number(tax.toFixed(2));
  }

  getUnemploymentIns() {
    const { unemploymentIns } = this.calculationType;
    const tax = this.gross * unemploymentIns.rate;
    this.totalTax += tax;
    return Number(tax.toFixed(2));
  }

  getMedicalIns() {
    const { medicalIns } = this.calculationType;
    const tax =
      this.gross <= medicalIns.limit
        ? this.gross * medicalIns.firstRate
        : (this.gross - medicalIns.limit) * medicalIns.secondRate + medicalIns.plus;
    this.totalTax += tax;
    return Number(tax.toFixed(2));
  }

  getCalculatedData() {
    return {
      timeOffDaysLeft: 0, // ! this is not calculated yet
      group: this.group || "Şöbə", // ! this is not calculated yet
      project: "Proyekt", // !
      tabelNo: this.id,
      nameSurnameFather: this.fullname,
      fin: this.fin,
      position: this.position,
      department: this.department,
      jobStartDate: this.joinDate,
      // work_hours: this.work_hours,
      // actual_hours: this.actual_hours,
      gross: this.gross,
      income_tax: this.getIncomeTax(),
      workDays: this.working_days,
      dsmf: this.getEmpPensionFund(),
      unemployment: this.getEmpUnemploymentIns(),
      healthIssurance: this.getEmpMedicalIns(),
      ...(this.calcType === "nonOilS" && {
        companyDSMF: this.getPensionFund(),
        companyUnemployment: this.getUnemploymentIns(),
        companyHealthIssurance: this.getMedicalIns(),
      }),
      empTotalTax: Number(this.empTotalTax.toFixed(2)),
      totalTax: Number(this.totalTax.toFixed(2)),
      nett: Number((this.gross - this.empTotalTax).toFixed(2)),
    };
  }
}

module.exports = {
  SalaryCalculator,
};
