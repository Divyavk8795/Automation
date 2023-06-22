const interestRates  = {"Conservative" : "1%", 
                        "Balanced" : "2%",
                        "Growth" : "3%",
                        "High Growth" : "4%"}

const interestRatesVal   = {"1%" : 0.01 , 
                            "2%" : 0.02,
                           "3%" : 0.03,
                           "4%" : 0.04}


const yosPerPercentage = {"full" :"100%", "partial" : "30%"}
const EligibleTerminationPaymentValue = {"100%" : 1, "30%" : 0.3}

const yosPerYear = {"min" : "Lump Sum Only", "average" : "5 YEARS", "max" : "10 YEARS"}

const contributionTable2022 = {1 : 10560, 2: 12672, 3 : 14784,
                               4 : 14784, 5 : 15840, 6: 16896,
                               7 : 17952, 8 : 19008, 9 : 20064, 
                               10 : 21120}

                               const payoutRatioTypeOne = {
                                1: ["20.0%", 0.2, "1/5th of account balance"],
                                2: ["25.0%", 0.25, "1/4th of account balance"],
                                3: ["33.3%", 0.333, "1/3rd of account balance"],
                                4: ["50.0%", 0.5, "1/2 of account balance"],
                                5: ["100%", 1.0, "Account balance"],
                              };
                              
                              const payoutRatioTypeTwo = {
                                1: ["10.0%", 0.1, "1/10th of account balance"],
                                2: ["11.1%", 0.111, "1/9th of account balance"],
                                3: ["12.5%", 0.125, "1/8th of account balance"],
                                4: ["14.3%", 0.143, "1/7th of account balance"],
                                5: ["16.7%", 0.167, "1/6th of account balance"],
                                6: ["20.0%", 0.2, "1/5th of account balance"],
                                7: ["25.0%", 0.25, "1/4th of account balance"],
                                8: ["33.3%", 0.333, "1/3rd of account balance"],
                                9: ["50.0%", 0.5, "1/2 of account balance"],
                                10: ["100%", 1.0, "Account balance"],
                              };                    

const timeElapsed = Date.now();
const today = new Date(timeElapsed);
const currentYear = today.getFullYear();
const membershipFee = 1019;
const taxRates = {0 :["32%" , 0.32]};

const retiredDayMonth = "31 October";
var lastClosingBalPhaseOne  = 0;
var closingBalPhaseTwo  = 0;
var closingBalPhaseThree  = 0;
var investmentRateVal = 0;

//phase 3 is always 3 rows (as per new rules from 2023) 
// but for ex-player if "planned retirement season" is <= 2018 should have 5 rows
var phaseThreeRows = 3

//var eligibleTerminationPaymentGrossPhaseTwo = 0;
var totalMemberBalanceAfterInvReturnPhaseTwo = 0;
var sumOfPeriodicPaymentGrossPhaseFour = 0;
var totalInvestmentReturn = 0;
var phaseOneList;
var phaseThreeList;
var phaseFourList;
var currentPhase = 0;

let AUDDollar = new Intl.NumberFormat(undefined, {
   style: 'decimal',
});

const inputData ={
   Name:'',
   MemberNo:'',
   Club:'',
   InvestmentOption:'',
   AdditionalMemberContribution:0,
   YrsNotPlayed:0,
   RetirementSeason:today.getFullYear,
   StartDate:today,
   LatestAcctBal:0,
    isExPlayer: false,
    isExPlayerMinus2: false,
   isRetAft2022: false,
   forecastRetSeason: currentYear,
   totalRetiredYears: 0,
   NumSeasonPlayedToDate: 0,
   ExpectedTotalCareerLength: 0,
   EligibleTerminationPayment: '',
   PeriodicPaymentPeriod : yosPerYear["max"]
};

const userInfo = Object.create(inputData);

function sendData()
{
   //collect input data
   userInfo.Name = $("#fldName").val();
   userInfo.MemberNo = $("#fldMemberNo").val();
   userInfo.Club = $("#fldClubName").val();
   userInfo.InvestmentOption = $("#fldInvestmentOption option:selected").text();   
   userInfo.AdditionalMemberContribution = parseFloat($("#fldMemberContribution").val());
   userInfo.YrsNotPlayed = $("#fldYearsNotPlayed").val();
   userInfo.RetirementSeason = $("#fldRetirementSeason").val();
   userInfo.LatestAcctBal = parseFloat($("#fldLatestAccountBalance").val());
   if($("#fldPlayerStartDatePicker").val()!='') userInfo.StartDate = new Date($("#fldPlayerStartDatePicker").val());
  
    userInfo.isExPlayer = userInfo.RetirementSeason < currentYear ? true : false;
    userInfo.isExPlayerMinus2 = (userInfo.RetirementSeason < (currentYear - 1)) && userInfo.isExPlayer ? true : false;
   userInfo.isRetAft2022 = userInfo.RetirementSeason > 2022 ? true: false;
   userInfo.forecastRetSeason  = parseInt(userInfo.RetirementSeason) + 1;
   userInfo.totalRetiredYears = (userInfo.RetirementSeason >= currentYear) ? userInfo.forecastRetSeason - currentYear : 0;

   if (userInfo.isExPlayer)
   {
      userInfo.NumSeasonPlayedToDate = (userInfo.RetirementSeason - userInfo.StartDate.getFullYear())-userInfo.YrsNotPlayed+1;
      userInfo.ExpectedTotalCareerLength = userInfo.NumSeasonPlayedToDate;    
   
      var minRetYrs = userInfo.isRetAft2022? 5:4;  
      userInfo.EligibleTerminationPayment = (userInfo.ExpectedTotalCareerLength >minRetYrs) ? yosPerPercentage["partial"] : yosPerPercentage["full"];
      if(userInfo.ExpectedTotalCareerLength > minRetYrs && userInfo.ExpectedTotalCareerLength <=7) 
      {
         userInfo.PeriodicPaymentPeriod = yosPerYear["average"]  // 5yrs
      }
      else if(userInfo.ExpectedTotalCareerLength <= minRetYrs) 
      {
         userInfo.PeriodicPaymentPeriod = yosPerYear["min"]  // lump sum
      }
     
   }
   else
   {
      userInfo.NumSeasonPlayedToDate = (currentYear - userInfo.StartDate.getFullYear())-userInfo.YrsNotPlayed;
      userInfo.ExpectedTotalCareerLength = userInfo.NumSeasonPlayedToDate + userInfo.totalRetiredYears;
      userInfo.EligibleTerminationPayment = (userInfo.ExpectedTotalCareerLength >5) ? yosPerPercentage["partial"] : yosPerPercentage["full"];

      if(userInfo.ExpectedTotalCareerLength == 6 || userInfo.ExpectedTotalCareerLength ==7) 
      {
         userInfo.PeriodicPaymentPeriod = yosPerYear["average"]      // 5yrs
      }
      else if(userInfo.ExpectedTotalCareerLength <=5) 
      {  
         userInfo.PeriodicPaymentPeriod = yosPerYear["min"]         
      }
      
   }

   $("#mainSection").hide();
   $("#summarySection").show();
   calculateSummarySection();
   $("#listSection").show();  
   calculatePhases();
}

function homePage()
{
   $("#mainSection").show();
   $("#disclaimerSection").hide();   
   $("#summarySection").hide();
   $("#listSection").hide();
}

function resetCalcButton()
{
   $("#calcButton").prop('disabled', true);
}

function calculateSummarySection()   
{

   $("#fldMemberNoReadonly").html(userInfo.MemberNo);
   $("#fldPlayerName").html(userInfo.Name);
   $("#fldAccountBalance").html(userInfo.LatestAcctBal + userInfo.AdditionalMemberContribution);
   var currentDate = today.toLocaleString('en-au',{day:'numeric', month:'long', year:'numeric'});
   $("#fldAccountBalanceDate").html(currentDate);
   $("#fldClub").html(userInfo.Club);
   $("#fldSelectedInvestmentOption").html(userInfo.InvestmentOption);
   $("#fldTaxRate").html(taxRates[0][0]);
   $("#fldCurrentSeason").html(currentYear);
   $("#fldPlannedRetirementDate").html(retiredDayMonth + " " + userInfo.RetirementSeason); 
   $("#fldRetiredYears").html(userInfo.totalRetiredYears);
   $("#fldInvestmentRate").html(interestRates[userInfo.InvestmentOption]);
   $("#fldMembershipFee").html(AUDDollar.format(membershipFee));
   $("#fldPlayerStartDate").html(userInfo.StartDate.toLocaleString('en-au',{day:'numeric', month:'long', year:'numeric'}));
   $("#fldNumSeasonPlayed").html(userInfo.NumSeasonPlayedToDate);   
   $("#fldTotalCareerLength").html(userInfo.ExpectedTotalCareerLength);
   $("#fldEligibleTerminationPayment").html(userInfo.EligibleTerminationPayment); 
   $("#fldPeriodicPaymentPeriod").html(userInfo.PeriodicPaymentPeriod);
   $("#fldIsExplayer").html(userInfo.isExPlayer ? 'Yes': 'No');

   investmentRateVal = interestRatesVal[$("#fldInvestmentRate").html()];

}

function calculatePhases()
{
   totalInvestmentReturn = 0;
   eligibleTerminationPaymentGrossPhaseTwo = 0;

   calculatePhaseOne();

   if ( userInfo.isExPlayer){
      calculatePhaseTwoForExPlayer();
      calculatePhaseThreeForExPlayer();
       calculatePhaseFourForExPlayer();
       $("#summaryDiv").hide();
   }
   else{
      calculatePhaseTwo();
      calculatePhaseThree();
		calculatePhaseFour();
   }  

   // hide membership fees
    if (userInfo.isExPlayerMinus2) {
        $("#membershipFeeDiv").hide();
    }

    $(".current-phase").html("");
    if (currentPhase > 1) {
        $("#currentPhase" + currentPhase).html("<span class='lemon-yellow-sun'>User is currently in this phase.</span>");
    }

   calculateFooter();
}

function calculatePhaseOne()
{
   var tblPhaseOne = $("#tblPhaseOne");
   tblPhaseOne.find("tr:gt(0)").remove();
   lastClosingBalPhaseOne  = 0 ; 
   phaseOneList = [];

   if(userInfo.isExPlayer) return;

   var numberOfRow = userInfo.totalRetiredYears;
   var fldNumSeasonPlayed = $("#fldNumSeasonPlayed").html();
   var forcastedSeasonPlayed = parseInt(fldNumSeasonPlayed) + 1;
  
   tblPhaseOne.append("<tbody>");
   for(let idx = 0; idx<numberOfRow ; idx++)
   {
      var YOS = forcastedSeasonPlayed + idx;
      var annualContributionAmountVal = (YOS > 10 ) ? contributionTable2022[10] : contributionTable2022[YOS];
      var openingBalFirstNovemberVal = (idx==0) ? parseInt($("#fldAccountBalance").html()) : phaseOneList[idx-1].ClosingBal31October;
      var startYear = currentYear+idx;

      var investmentReturnToMidFebVal = calculateInvestmentReturn(11, 1, currentYear-1+idx, 2, 14, startYear, openingBalFirstNovemberVal, investmentRateVal);
      
      var contribution25PercentVal = (annualContributionAmountVal * 0.25);
      var balanceAtMidOfFebVal = openingBalFirstNovemberVal + investmentReturnToMidFebVal + contribution25PercentVal;
      
      var investmentReturnToMidMayVal = calculateInvestmentReturn(2, 14, startYear, 5, 14, startYear, balanceAtMidOfFebVal, investmentRateVal);

      var balanceAtMidOfMayVal = balanceAtMidOfFebVal + investmentReturnToMidMayVal + contribution25PercentVal;

      var investmentReturnToMidAugVal = calculateInvestmentReturn(5, 14, startYear, 8, 14, startYear, balanceAtMidOfMayVal, investmentRateVal);

      var contribution50PercentVal = (annualContributionAmountVal * 0.5);

      var balanceAtMidOfAugVal = balanceAtMidOfMayVal + investmentReturnToMidAugVal + contribution50PercentVal;

      var investmentReturnTo31OctVal = calculateInvestmentReturn(8, 14, startYear, 10, 31, startYear, balanceAtMidOfAugVal, investmentRateVal);

      var closingBal31OctoberVal = balanceAtMidOfAugVal + investmentReturnTo31OctVal;

      var annualInvestmentVal = investmentReturnToMidFebVal + investmentReturnToMidMayVal + investmentReturnToMidAugVal + investmentReturnTo31OctVal;

      phaseOneList.push({Season: startYear, 
                         InvestmentRate : investmentRateVal, 
                         AnnualContributionAmount  : annualContributionAmountVal,
                         OpeningBalFirstNovember :  openingBalFirstNovemberVal,
                         InvestmentReturnToMidFeb : investmentReturnToMidFebVal,
                         Contribution25Percent : contribution25PercentVal,
                         BalanceAtMidOfFeb : balanceAtMidOfFebVal,
                         InvestmentReturnToMidMay : investmentReturnToMidMayVal,
                         Contribution25Percent : contribution25PercentVal,
                         BalanceAtMidOfMay : balanceAtMidOfMayVal,
                         InvestmentReturnToMidAug : investmentReturnToMidAugVal,
                         Contribution50Percent : contribution50PercentVal,
                         BalanceAtMidOfAug : balanceAtMidOfAugVal,
                         InvestmentReturnTo31Oct : investmentReturnTo31OctVal,
                         ClosingBal31October : closingBal31OctoberVal,
                         AnnualInvestment : annualInvestmentVal
                         });

                         tblPhaseOne.append("<tr><td>"+ phaseOneList[idx].Season+"</td>"+
                                             "<td>"+ AUDDollar.format(roundValue(phaseOneList[idx].AnnualContributionAmount))+"</td>"+ 
                                             "<td>"+AUDDollar.format(roundValue(phaseOneList[idx].AnnualInvestment))+"</td>"+
                                             "<td>"+AUDDollar.format(roundValue(phaseOneList[idx].ClosingBal31October))+"</td>"
                                             +"</tr>");

                        totalInvestmentReturn+= annualInvestmentVal;  

                  if( idx == numberOfRow - 1)
                  {
                     lastClosingBalPhaseOne = phaseOneList[idx].ClosingBal31October;
                  }
   }
   tblPhaseOne.append("</tbody>");


}

function calculatePhaseTwo()
{
   var tblPhaseTwo = $("#tblPhaseTwo");
   tblPhaseTwo.find("tr:gt(0)").remove();

   var openingMemberBalance = lastClosingBalPhaseOne;
   var fldPlannedRetirementDate =new Date($("#fldPlannedRetirementDate").html());
   var fromDay = fldPlannedRetirementDate.getDate();
   var fromMonth = fldPlannedRetirementDate.getMonth()+1;
   var fromYear = fldPlannedRetirementDate.getFullYear();
   var investmentReturnTo30JuneVal = calculateInvestmentReturn(fromMonth, fromDay, fromYear, 6, 30, userInfo.forecastRetSeason, openingMemberBalance, investmentRateVal);
   var totalMemberBalanceAfterInvReturn = openingMemberBalance + investmentReturnTo30JuneVal;
   var eligibleTerminationPayment = EligibleTerminationPaymentValue[$("#fldEligibleTerminationPayment").html()];
   var eligibleTerminationPaymentGrossPhaseTwo  = totalMemberBalanceAfterInvReturn * eligibleTerminationPayment;
   totalMemberBalanceAfterInvReturnPhaseTwo = eligibleTerminationPaymentGrossPhaseTwo;
   var eligibleTerminationPaymentAfterFeesTax = ((totalMemberBalanceAfterInvReturn * eligibleTerminationPayment) - ((totalMemberBalanceAfterInvReturn * eligibleTerminationPayment) * taxRates[0][1]) - membershipFee);
   var closingBalance = (totalMemberBalanceAfterInvReturn - eligibleTerminationPaymentGrossPhaseTwo);

   closingBalPhaseTwo = closingBalance;

   tblPhaseTwo.append("<tbody><tr><td>"+ userInfo.forecastRetSeason +"</td>"+
                          "<td>"+ AUDDollar.format(roundValue(openingMemberBalance))+"</td>"+ 
                          "<td>"+AUDDollar.format(roundValue(investmentReturnTo30JuneVal))+"</td>"+
                          "<td>"+AUDDollar.format(roundValue(totalMemberBalanceAfterInvReturn))+"</td>"+
                          "<td>"+AUDDollar.format(roundValue(eligibleTerminationPaymentGrossPhaseTwo))+"</td>"+
                          "<td>"+AUDDollar.format(roundValue(eligibleTerminationPaymentAfterFeesTax))+"</td>"+
                          "<td>"+AUDDollar.format(roundValue(closingBalance))+"</td>"
                          +"</tr></tbody>");

   totalInvestmentReturn+=investmentReturnTo30JuneVal;
   
}

function calculatePhaseThree()
{
   var tblPhaseThree = $("#tblPhaseThree");
   tblPhaseThree.find("tr:gt(0)").remove();
   phaseThreeList = [];

   //Phase 3 - 6+ yrs only
   if(userInfo.ExpectedTotalCareerLength < 6) return;
   
   var seasonStartPhaseThree = userInfo.forecastRetSeason + 1;
   closingBalPhaseThree = 0;

   var phaseTwoInvestmentReturn = (closingBalPhaseTwo * investmentRateVal);

   tblPhaseThree.append("<tbody>");
   for(let index = 0; index <phaseThreeRows ; index++)
   {
      var prevClosingBal =  (index == 0? 0: phaseThreeList[index-1].ClosingBal);
      var currInvestmentReturn = prevClosingBal * investmentRateVal;
      

      phaseThreeList.push({Season: seasonStartPhaseThree+index, 
                           InvestmentReturn : index == 0 ?  phaseTwoInvestmentReturn: currInvestmentReturn,
                           ClosingBal : index == 0 ?  closingBalPhaseTwo + phaseTwoInvestmentReturn : prevClosingBal + currInvestmentReturn
         });

      tblPhaseThree.append("<tr><td>"+ phaseThreeList[index].Season+"</td>"+
                        "<td>"+ AUDDollar.format(roundValue(phaseThreeList[index].InvestmentReturn))+"</td>"+ 
                        "<td>"+AUDDollar.format(roundValue(phaseThreeList[index].ClosingBal))+"</td>"+
                         +"</tr>")

      totalInvestmentReturn+= phaseThreeList[index].InvestmentReturn; 

       if(index == phaseThreeRows-1)       
       {
         closingBalPhaseThree = roundValue(phaseThreeList[index].ClosingBal);
       }          

   }
   tblPhaseThree.append("</tbody>");

}

function calculatePhaseFour()
{
   var tblPhaseFour = $("#tblPhaseFour");
   tblPhaseFour.find("tr:gt(0)").remove();
   phaseFourList = [];

   //Phase 3 - 6+ yrs only
   if(userInfo.ExpectedTotalCareerLength < 6) return;

   var seasonStartPhase4  = phaseThreeList[phaseThreeList.length-1].Season+1;

   // for phase 4, 
   // if Expected Total Career Length (years of service) if 6 or 7 --> show 5 rows
   // but if 8+ --> show 10 rows
   var maxIndex = userInfo.ExpectedTotalCareerLength == 6 || userInfo.ExpectedTotalCareerLength == 7 ? Object.keys(payoutRatioTypeOne).length : Object.keys(payoutRatioTypeTwo).length;                                              
   var openingBal = 0;
   var investmentReturn = 0;
   var periodicPaymentGross = 0;
   var periodicPaymentTaxAmnt = 0;

   tblPhaseFour.append("<tbody>");

   sumOfPeriodicPaymentGrossPhaseFour = 0;
   for(let index = 0; index<maxIndex; index++)
   {
      openingBal = (index == 0 ? closingBalPhaseThree : phaseFourList[index-1].ClosingBal);
      investmentReturn = (index == 0 ? closingBalPhaseThree * investmentRateVal : phaseFourList[index-1].ClosingBal * investmentRateVal);

      var payoutRatioValue = userInfo.ExpectedTotalCareerLength == 6 || userInfo.ExpectedTotalCareerLength == 7 ?  payoutRatioTypeOne[index+1][1]:  payoutRatioTypeTwo[index+1][1];
      var payoutRatioDisplay = userInfo.ExpectedTotalCareerLength == 6 || userInfo.ExpectedTotalCareerLength == 7 ?  payoutRatioTypeOne[index+1][2]:  payoutRatioTypeTwo[index+1][2];

      periodicPaymentGross = (openingBal + investmentReturn) * payoutRatioValue;
      periodicPaymentTaxAmnt = periodicPaymentGross * taxRates[0][1];
      phaseFourList.push({Season: seasonStartPhase4++, 
                           PayoutRatio: payoutRatioDisplay, 
                           OpeniongBal: openingBal,
                           InvestmentReturn : investmentReturn,
                           PeriodicPaymentGross : periodicPaymentGross,
                           PeriodicPaymentTaxAmnt: periodicPaymentTaxAmnt,
                           PeriodicPaymentAftTax : periodicPaymentGross -(periodicPaymentGross * taxRates[0][1]),
                           ClosingBal : (openingBal + investmentReturn) - periodicPaymentGross
                        })

      sumOfPeriodicPaymentGrossPhaseFour += periodicPaymentGross;   

      tblPhaseFour.append("<tr><td>"+ phaseFourList[index].Season+"</td>"+
      "<td>"+ phaseFourList[index].PayoutRatio+"</td>"+ 
      "<td>"+AUDDollar.format(roundValue(phaseFourList[index].OpeniongBal))+"</td>"+
      "<td>"+AUDDollar.format(roundValue(phaseFourList[index].InvestmentReturn))+"</td>"+
      "<td>"+AUDDollar.format(roundValue(phaseFourList[index].PeriodicPaymentGross))+"</td>"+
      "<td>"+AUDDollar.format(roundValue(phaseFourList[index].PeriodicPaymentTaxAmnt))+"</td>"+
      "<td>"+AUDDollar.format(roundValue(phaseFourList[index].PeriodicPaymentAftTax))+"</td>"+
      "<td>"+AUDDollar.format(roundValue(phaseFourList[index].ClosingBal))+"</td>"
      +"</tr>");

      totalInvestmentReturn+=phaseFourList[index].InvestmentReturn;
   }
   tblPhaseFour.append("</tbody>");
}

function calculatePhaseTwoForExPlayer()
{
   var tblPhaseTwo = $("#tblPhaseTwo");
   tblPhaseTwo.find("tr:gt(0)").remove();

    if (userInfo.forecastRetSeason == currentYear) {
        currentPhase = 2;

        var openingMemberBalance = userInfo.LatestAcctBal;
        var fldPlannedRetirementDate = new Date($("#fldPlannedRetirementDate").html());
        var fromDay = fldPlannedRetirementDate.getDate();
        var fromMonth = fldPlannedRetirementDate.getMonth() + 1;
        var fromYear = fldPlannedRetirementDate.getFullYear();
        var investmentReturnTo30JuneVal = calculateInvestmentReturn(fromMonth, fromDay, fromYear, 6, 30, userInfo.forecastRetSeason, openingMemberBalance, investmentRateVal);
        var totalMemberBalanceAfterInvReturn = openingMemberBalance + investmentReturnTo30JuneVal;
        totalMemberBalanceAfterInvReturnPhaseTwo = totalMemberBalanceAfterInvReturn;
        var eligibleTerminationPayment = EligibleTerminationPaymentValue[$("#fldEligibleTerminationPayment").html()];
        var eligibleTerminationPaymentGrossPhaseTwo = totalMemberBalanceAfterInvReturn * eligibleTerminationPayment;
        var eligibleTerminationPaymentAfterFeesTax = ((totalMemberBalanceAfterInvReturn * eligibleTerminationPayment) - ((totalMemberBalanceAfterInvReturn * eligibleTerminationPayment) * taxRates[0][1]) - membershipFee);
        var closingBalance = (totalMemberBalanceAfterInvReturn - eligibleTerminationPaymentGrossPhaseTwo);

        closingBalPhaseTwo = closingBalance;

        tblPhaseTwo.append("<tbody><tr><td>" + userInfo.forecastRetSeason + "</td>" +
            "<td>" + AUDDollar.format(roundValue(openingMemberBalance)) + "</td>" +
            "<td>" + AUDDollar.format(roundValue(investmentReturnTo30JuneVal)) + "</td>" +
            "<td>" + AUDDollar.format(roundValue(totalMemberBalanceAfterInvReturn)) + "</td>" +
            "<td>" + AUDDollar.format(roundValue(eligibleTerminationPaymentGrossPhaseTwo)) + "</td>" +
            "<td>" + AUDDollar.format(roundValue(eligibleTerminationPaymentAfterFeesTax)) + "</td>" +
            "<td>" + AUDDollar.format(roundValue(closingBalance)) + "</td>"
            + "</tr></tbody>");

        totalInvestmentReturn += investmentReturnTo30JuneVal;
    } else {
        tblPhaseTwo.append(`<tbody><tr><td>${userInfo.forecastRetSeason}</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            </tr></tbody>`
        );
    }

}

function calculatePhaseThreeForExPlayer()
{
   var tblPhaseThree = $("#tblPhaseThree");
   tblPhaseThree.find("tr:gt(0)").remove();
   phaseThreeList = [];

   //Phase 3 (ExPlayer) - 5+ yrs only
   if(userInfo.ExpectedTotalCareerLength < 5 ) return;

   var seasonStartPhaseThree = userInfo.forecastRetSeason + 1;   
   var closingBalance = lastClosingBalPhaseOne;
   closingBalPhaseThree = 0;

   switch (true) {
      case (userInfo.RetirementSeason <= 2016):
         phaseThreeRows = 5;
         break;
      case (userInfo.RetirementSeason == 2017):
         phaseThreeRows = 4;
         break;
      default:    // fldRetirementSeason >= 2018
         phaseThreeRows = 3;
  }

   var fldLatestAccountBalance = userInfo.LatestAcctBal;
   tblPhaseThree.append("<tbody>");
   for(let index = 0; index <phaseThreeRows ; index++)
   {
      if((seasonStartPhaseThree+index) == currentYear)
      {
         closingBalPhaseTwo = fldLatestAccountBalance;
         phaseThreeList.push({Season: seasonStartPhaseThree+index, 
            InvestmentReturn : closingBalPhaseTwo * investmentRateVal,
            ClosingBal : closingBalPhaseTwo + (closingBalPhaseTwo * investmentRateVal)
         });
      }
      else
      {
         phaseThreeList.push({Season: seasonStartPhaseThree+index, 
                              InvestmentReturn : index == 0 ? closingBalPhaseTwo * investmentRateVal : 
                                                            phaseThreeList[index-1].ClosingBal * investmentRateVal,
                              ClosingBal : index == 0 ?  closingBalPhaseTwo + (closingBalance * investmentRateVal) : 
                                                         phaseThreeList[index-1].ClosingBal + (phaseThreeList[index-1].ClosingBal * investmentRateVal)
            });
      }

      if (phaseThreeList[index].Season >= currentYear)
      {
          // determine current phase
          if (phaseThreeList[index].Season == currentYear) {
              currentPhase = 3;
          }
         tblPhaseThree.append("<tr><td>"+ phaseThreeList[index].Season+"</td>"+
                        "<td>"+ (phaseThreeList[index].InvestmentReturn == 0 ? '' : AUDDollar.format(roundValue(phaseThreeList[index].InvestmentReturn)))+"</td>"+ 
                        "<td>"+(phaseThreeList[index].ClosingBal == 0 ? '' : AUDDollar.format(roundValue(phaseThreeList[index].ClosingBal)))+"</td></tr>")
      } else {  // samtest
          tblPhaseThree.append("<tr><td>" + phaseThreeList[index].Season + "</td>" +
              "<td></td>" +
              "<td></td></tr>")
      }
      

      if(index == phaseThreeRows-1) {closingBalPhaseThree = roundValue(phaseThreeList[index].ClosingBal)};
               

   }
   tblPhaseThree.append("</tbody>");

}

function calculatePhaseFourForExPlayer()
{
   var tblPhaseFour = $("#tblPhaseFour");
   tblPhaseFour.find("tr:gt(0)").remove();   
   phaseFourList = [];

   //Phase 5 (ExPlayer) - 5+ yrs only
   if(userInfo.ExpectedTotalCareerLength < 5) return;

   var seasonStartPhase4  = phaseThreeList[phaseThreeList.length-1].Season+1;

   // for phase 4, 
   // if Expected Total Career Length (years of service) betweeen 5 - 7 --> show 5 rows
   // but if 8+ --> show 10 rows
   var maxIndex = (userInfo.ExpectedTotalCareerLength > 4 && userInfo.ExpectedTotalCareerLength < 8) ? Object.keys(payoutRatioTypeOne).length : Object.keys(payoutRatioTypeTwo).length;                                              
   var openingBal = 0;
   var investmentReturn = 0;
   var periodicPaymentGross = 0;
   var periodicPaymentTaxAmnt = 0;
   var fldLatestAccountBalance = userInfo.LatestAcctBal;

   tblPhaseFour.append("<tbody>");

   sumOfPeriodicPaymentGrossPhaseFour = 0;

   for(let index = 0; index<maxIndex; index++)
   {
      if(seasonStartPhase4 == currentYear)
      {
         closingBalPhaseThree = fldLatestAccountBalance;
         openingBal = closingBalPhaseThree;
         investmentReturn = closingBalPhaseThree * investmentRateVal;
      }
      else
      {
         openingBal = (index == 0 ? closingBalPhaseThree : phaseFourList[index-1].ClosingBal);
         investmentReturn = (index == 0 ? closingBalPhaseThree * investmentRateVal : phaseFourList[index-1].ClosingBal * investmentRateVal);
      }

      var payoutRatioValue = (userInfo.ExpectedTotalCareerLength > 4 && userInfo.ExpectedTotalCareerLength < 8)?  payoutRatioTypeOne[index+1][1]:  payoutRatioTypeTwo[index+1][1];
      var payoutRatioDisplay = (userInfo.ExpectedTotalCareerLength > 4 && userInfo.ExpectedTotalCareerLength < 8) ?  payoutRatioTypeOne[index+1][2]:  payoutRatioTypeTwo[index+1][2];   
  
      periodicPaymentGross = (openingBal + investmentReturn) * payoutRatioValue;
      periodicPaymentTaxAmnt = periodicPaymentGross * taxRates[0][1];
      phaseFourList.push({Season: seasonStartPhase4++, 
                           PayoutRatio: payoutRatioDisplay, 
                           OpeningBal: openingBal,
                           InvestmentReturn : investmentReturn,
                           PeriodicPaymentGross : periodicPaymentGross,
                           PeriodicPaymentTaxAmnt: periodicPaymentTaxAmnt,
                           PeriodicPaymentAftTax : periodicPaymentGross -(periodicPaymentGross * taxRates[0][1]),
                           ClosingBal : (openingBal + investmentReturn) - periodicPaymentGross
                        })

      sumOfPeriodicPaymentGrossPhaseFour += periodicPaymentGross;   

      if (phaseFourList[index].Season >= currentYear)
      {

          // determine current phase
          if (phaseFourList[index].Season == currentYear) {
              currentPhase = 4;
          }

         tblPhaseFour.append("<tr><td>"+ phaseFourList[index].Season+"</td>"+
         "<td>"+ phaseFourList[index].PayoutRatio+"</td>"+ 
         "<td>"+ (phaseFourList[index].OpeningBal == 0 ? '' : AUDDollar.format(roundValue(phaseFourList[index].OpeningBal)))+"</td>"+
         "<td>"+(phaseFourList[index].InvestmentReturn == 0 ? '' : AUDDollar.format(roundValue(phaseFourList[index].InvestmentReturn)))+"</td>"+
         "<td>"+ (phaseFourList[index].PeriodicPaymentGross == 0 ? '' : AUDDollar.format(roundValue(phaseFourList[index].PeriodicPaymentGross)))+"</td>"+
         "<td>"+ (phaseFourList[index].PeriodicPaymentTaxAmnt == 0 ? '' : AUDDollar.format(roundValue(phaseFourList[index].PeriodicPaymentTaxAmnt)))+"</td>"+
         "<td>"+ (phaseFourList[index].PeriodicPaymentAftTax == 0 ? '' : AUDDollar.format(roundValue(phaseFourList[index].PeriodicPaymentAftTax)))+"</td>"+
         "<td>"+ (phaseFourList[index].ClosingBal == 0 ? '' : AUDDollar.format(roundValue(phaseFourList[index].ClosingBal)))+"</td>"
         +"</tr>");
      } else {
          tblPhaseFour.append("<tr><td>" + phaseFourList[index].Season + "</td>" +
              "<td>" + phaseFourList[index].PayoutRatio + "</td>" +
              "<td></td>" +
              "<td></td>" +
              "<td></td>" +
              "<td></td>" +
              "<td></td>"
              + "</tr>");
      }

      totalInvestmentReturn+=phaseFourList[index].InvestmentReturn;
   }
   tblPhaseFour.append("</tbody>");
}

function calculateFooter()
{
   // the balance of the last row in phase 1
   $("#fldBalanceAtRetirement").html(!userInfo.isExPlayer ? AUDDollar.format(roundValue(lastClosingBalPhaseOne)) : '');

   // Total Member Balance after Inv. Return ($) of phase 2
   $("#fldLumpsumPayoutGross").html(!userInfo.isExPlayer ? AUDDollar.format(roundValue(totalMemberBalanceAfterInvReturnPhaseTwo)) : '');

   // sum of "Periodic Payment Gross  ($)" from phase 4
   $("#fldSumPeriodicPaymentGross").html(!userInfo.isExPlayer ? AUDDollar.format(roundValue(sumOfPeriodicPaymentGrossPhaseFour)) : '');

   // sum of all investment return from phase 1, 2, 3 ,4
   $("#fldTotalInvestmentReturn").html(!userInfo.isExPlayer ? AUDDollar.format(roundValue(totalInvestmentReturn)) : '');
}

function calculateInvestmentReturn(fromMonth, fromDay, fromYear, toMonth, toDay, year, balanceVal, investmentRateVal)
{
   var selectedFromDate = new Date(fromYear, fromMonth-1, fromDay);
   var selectedToDate = new Date(year, toMonth-1, toDay);
      // To calculate the time difference of two dates
   var difference_In_Time = selectedToDate.getTime() - selectedFromDate.getTime();
   // To calculate the no. of days between two dates
   var numberOfDays = Math.round(difference_In_Time / (1000 * 3600 * 24));
   var numdOfDaysPerYear = leapyear(year) ? 366 : 365;
   var investmentReturn = ((balanceVal * investmentRateVal)/numdOfDaysPerYear) * numberOfDays;
   return investmentReturn;
}

function leapyear(year)
{
   return (year % 100 === 0) ? (year % 400 === 0) : (year % 4 === 0);
}

function roundValue(number)
{
   return Math.round((number + Number.EPSILON) * 100) / 100
}

