
function decimalToBinary(decimal) {
    let binary = "";
    let quotient = decimal;
  
    // Handle special cases of input value
    if (decimal === 0) {
      return "0";
    }
  
    // Convert decimal to binary
    while (quotient > 0) {
      let remainder = quotient % 2;
      binary = remainder.toString() + binary;
      quotient = Math.floor(quotient / 2);
    }
  
    return binary;
}

function decimalToHex(decimal) {
    let hex = "";
    let quotient = decimal;

    // Handle special cases of input value
    if (decimal === 0) {
        return "0";
    }

    // Convert decimal to hexadecimal
    while (quotient > 0) {
        let remainder = quotient % 16;
        if (remainder < 10) {
        hex = remainder.toString() + hex;
        } else {
        hex = String.fromCharCode(remainder + 55) + hex;
        }
        quotient = Math.floor(quotient / 16);
    }

    return hex;
}

function hexStrFromDecimals(input){
    var hex = "";

    for(var i = 0 ; i < input.length ; i++){
        var value = (decimalToHex(input[i]).length == 2) ? "" : "0";
        value += decimalToHex(input[i]);
        hex += value;
    }

    return hex;
}

function hexStrFromHalfBytesDecimals(input){
    var hex = "";

    for(var i = 0 ; i < input.length ; i++){
        var value = decimalToHex(input[i]);
        hex += value;
    }

    return hex;
}

function getHalfByteHexArray(input){
    var hexArray = [];

    var inputHexStr = hexStrFromDecimals(input);

    for(var i = 0 ; i < inputHexStr.length ; i++){
        hexArray.push(parseInt(inputHexStr[i], 16));
    }

    return hexArray;
}

function getSigned(array, start, end){
    var input = hexStrFromHalfBytesDecimals(array.slice(start, end));

    result = twosHexToDecimal(input);

    return result;
}

function twosHexToDecimal(input){
    // Convert hex string to integer
    let intVal = parseInt(input, 16);

    // Check if the most significant bit is set (i.e., negative number)
    if ((intVal & 0x80000000) !== 0) {
        // Compute the two's complement by inverting all bits and adding one
        intVal = (~intVal & 0xFFFFFFFF) + 1;
        // Convert back to negative integer
        intVal = -intVal;
    }

    return intVal;
}


function decodeUplink(input){
    var result = {};

    hexStr = getHalfByteHexArray(input);

    var type = hexStr[0]*16 + hexStr[1];

    if(type != 2){
        result.errors = ["The first hexadecimal character of the payload must be 2 for an uplink"];
        return result;
    }

    result.profileNbr = hexStr[2];
    result.profileVersion = hexStr[3];

    switch(result.profileNbr){
        case 1:
            result.dateTime = ((hexStr[4]*16 + hexStr[5])*16 + hexStr[6])*16 + hexStr[7];

            result["Ea+"] = ((((((hexStr[8]*16 + hexStr[9])*16 + hexStr[10])*16 + hexStr[11])*16 + hexStr[12])*16 + hexStr[13])*16 + hexStr[14])*16 + hexStr[15];
            result["Ea-"] = ((((((hexStr[16]*16 + hexStr[17])*16 + hexStr[18])*16 + hexStr[19])*16 + hexStr[20])*16 + hexStr[21])*16 + hexStr[22])*16 + hexStr[23];
            result["Er+"] = ((((((hexStr[24]*16 + hexStr[25])*16 + hexStr[26])*16 + hexStr[27])*16 + hexStr[28])*16 + hexStr[29])*16 + hexStr[30])*16 + hexStr[31];
            result["Er-"] = ((((((hexStr[32]*16 + hexStr[33])*16 + hexStr[34])*16 + hexStr[35])*16 + hexStr[36])*16 + hexStr[37])*16 + hexStr[38])*16 + hexStr[39];

            result.pulseMeter = ((((((hexStr[40]*16 + hexStr[41])*16 + hexStr[42])*16 + hexStr[43])*16 + hexStr[44])*16 + hexStr[45])*16 + hexStr[46])*16 + hexStr[47];
            
            var decimalInputs = hexStr[48]*16 + hexStr[49];
            var binaryInputs = decimalToBinary(decimalInputs);

            result.native = {digitalInput1: binaryInputs.substring(0, 1), digitalInput2: binaryInputs.substring(1, 2)};
            result.module1 = {digitalInput1: binaryInputs.substring(2, 3), digitalInput2: binaryInputs.substring(3, 4)};
            result.module2 = {digitalInput1: binaryInputs.substring(4, 5), digitalInput2: binaryInputs.substring(5, 6)};
            result.module3 = {digitalInput1: binaryInputs.substring(6, 7), digitalInput2: binaryInputs.substring(7, 8)};
            result.module4 = {digitalInput1: binaryInputs.substring(8, 9), digitalInput2: binaryInputs.substring(9, 10)};
            result.voltageDetection = { 
                iTR1: binaryInputs.substring(10, 11), 
                iTR2: binaryInputs.substring(11, 12), 
                iTR3: binaryInputs.substring(12, 13), 
                iTR4: binaryInputs.substring(13, 14)  
            };
            
            result.statusChangeCounter = {
                native: {
                    input1: decimalToHex(hexStr[50]).substring(0, 4),
                    input2: decimalToHex(hexStr[50]).substring(4, 8),
                },
                module1: {
                    digitalInput1: decimalToHex(hexStr[51]).substring(0, 4),
                    digitalInput2: decimalToHex(hexStr[51]).substring(4, 8),
                }
            };

            break;
        case 2:
            result.dateTime = ((hexStr[4]*16 + hexStr[5])*16 + hexStr[6])*16 + hexStr[7];

            result.load1 = {
                "Ea+": (((hexStr[8]*16 + hexStr[9])*16 + hexStr[10])*16 + hexStr[11])*1000,
                "Er+": (((hexStr[12]*16 + hexStr[13])*16 + hexStr[14])*16 + hexStr[15])*1000,
            };
            result.load2 = {
                "Ea+": (((hexStr[16]*16 + hexStr[17])*16 + hexStr[18])*16 + hexStr[19])*1000,
                "Er+": (((hexStr[20]*16 + hexStr[21])*16 + hexStr[22])*16 + hexStr[23])*1000,
            };
            result.load3 = {
                "Ea+": (((hexStr[24]*16 + hexStr[25])*16 + hexStr[26])*16 + hexStr[27])*1000,
                "Er+": (((hexStr[28]*16 + hexStr[29])*16 + hexStr[30])*16 + hexStr[31])*1000,
            };
            result.load4 = {
                "Ea+": (((hexStr[32]*16 + hexStr[33])*16 + hexStr[34])*16 + hexStr[35])*1000,
                "Er+": (((hexStr[36]*16 + hexStr[37])*16 + hexStr[38])*16 + hexStr[39])*1000,
            };

            result.pulseMeter = ((((((hexStr[40]*16 + hexStr[41])*16 + hexStr[42])*16 + hexStr[43])*16 + hexStr[44])*16 + hexStr[45])*16 + hexStr[46])*16 + hexStr[47];
            
            var decimalInputs = hexStr[48]*16 + hexStr[49];
            var binaryInputs = decimalToBinary(decimalInputs);

            result.native = {digitalInput1: binaryInputs.substring(0, 1), digitalInput2: binaryInputs.substring(1, 2)};
            result.module1 = {digitalInput1: binaryInputs.substring(2, 3), digitalInput2: binaryInputs.substring(3, 4)};
            result.module2 = {digitalInput1: binaryInputs.substring(4, 5), digitalInput2: binaryInputs.substring(5, 6)};
            result.module3 = {digitalInput1: binaryInputs.substring(6, 7), digitalInput2: binaryInputs.substring(7, 8)};
            result.module4 = {digitalInput1: binaryInputs.substring(8, 9), digitalInput2: binaryInputs.substring(9, 10)};
            result.voltageDetection = { 
                iTR1: binaryInputs.substring(10, 11), 
                iTR2: binaryInputs.substring(11, 12), 
                iTR3: binaryInputs.substring(12, 13), 
                iTR4: binaryInputs.substring(13, 14)  
            };
            
            result.statusChangeCounter = {
                native: {
                    input1: decimalToHex(hexStr[50]).substring(0, 4),
                    input2: decimalToHex(hexStr[50]).substring(4, 8),
                },
                module1: {
                    digitalInput1: decimalToHex(hexStr[51]).substring(0, 4),
                    digitalInput2: decimalToHex(hexStr[51]).substring(4, 8),
                }
            };

            break;
        case 3:
            result.dateTime = ((hexStr[4]*16 + hexStr[5])*16 + hexStr[6])*16 + hexStr[7];
            
            result.load1 = {
                "Ea+": (((hexStr[8]*16 + hexStr[9])*16 + hexStr[10])*16 + hexStr[11])*1000,
                "Ea-": (((hexStr[12]*16 + hexStr[13])*16 + hexStr[14])*16 + hexStr[15])*1000,
            };
            result.load2 = {
                "Ea+": (((hexStr[16]*16 + hexStr[17])*16 + hexStr[18])*16 + hexStr[19])*1000,
                "Ea-": (((hexStr[20]*16 + hexStr[21])*16 + hexStr[22])*16 + hexStr[23])*1000,
            };
            result.load3 = {
                "Ea+": (((hexStr[24]*16 + hexStr[25])*16 + hexStr[26])*16 + hexStr[27])*1000,
                "Ea-": (((hexStr[28]*16 + hexStr[29])*16 + hexStr[30])*16 + hexStr[31])*1000,
            };
            result.load4 = {
                "Ea+": (((hexStr[32]*16 + hexStr[33])*16 + hexStr[34])*16 + hexStr[35])*1000,
                "Ea-": (((hexStr[36]*16 + hexStr[37])*16 + hexStr[38])*16 + hexStr[39])*1000,
            };
            
            result.pulseMeter = ((((((hexStr[40]*16 + hexStr[41])*16 + hexStr[42])*16 + hexStr[43])*16 + hexStr[44])*16 + hexStr[45])*16 + hexStr[46])*16 + hexStr[47];
            
            var decimalInputs = hexStr[48]*16 + hexStr[49];
            var binaryInputs = decimalToBinary(decimalInputs);

            result.native = {digitalInput1: binaryInputs.substring(0, 1), digitalInput2: binaryInputs.substring(1, 2)};
            result.module1 = {digitalInput1: binaryInputs.substring(2, 3), digitalInput2: binaryInputs.substring(3, 4)};
            result.module2 = {digitalInput1: binaryInputs.substring(4, 5), digitalInput2: binaryInputs.substring(5, 6)};
            result.module3 = {digitalInput1: binaryInputs.substring(6, 7), digitalInput2: binaryInputs.substring(7, 8)};
            result.module4 = {digitalInput1: binaryInputs.substring(8, 9), digitalInput2: binaryInputs.substring(9, 10)};
            result.voltageDetection = { 
                iTR1: binaryInputs.substring(10, 11), 
                iTR2: binaryInputs.substring(11, 12), 
                iTR3: binaryInputs.substring(12, 13), 
                iTR4: binaryInputs.substring(13, 14)  
            };
            
            result.statusChangeCounter = {
                native: {
                    input1: decimalToHex(hexStr[50]).substring(0, 4),
                    input2: decimalToHex(hexStr[50]).substring(4, 8),
                },
                module1: {
                    digitalInput1: decimalToHex(hexStr[51]).substring(0, 4),
                    digitalInput2: decimalToHex(hexStr[51]).substring(4, 8),
                }
            };

            break;
        case 4:
            result.dateTime = ((hexStr[4]*16 + hexStr[5])*16 + hexStr[6])*16 + hexStr[7];
            
            result.pTotAvg = getSigned(hexStr, 8, 12);
            result.qTotAvg = getSigned(hexStr, 12, 16);
            result.sTotAvg = ((hexStr[16]*16 + hexStr[17])*16 + hexStr[18])*16 + hexStr[19];
            result.pFTotAvg = getSigned(hexStr, 20, 22);
            result.I1Avg = ((hexStr[22]*16 + hexStr[23])*16 + hexStr[24])*16 + hexStr[25];
            result.I2Avg = ((hexStr[26]*16 + hexStr[27])*16 + hexStr[28])*16 + hexStr[29];
            result.I3Avg = ((hexStr[30]*16 + hexStr[31])*16 + hexStr[32])*16 + hexStr[33];
            result.FAvg = (((hexStr[34]*16 + hexStr[35])*16 + hexStr[36])*16 + hexStr[37])/1000;
            
            var decimalInputs = hexStr[38]*16 + hexStr[39];
            var binaryInputs = decimalToBinary(decimalInputs);

            result.native = {digitalInput1: binaryInputs.substring(0, 1), digitalInput2: binaryInputs.substring(1, 2)};
            result.module1 = {digitalInput1: binaryInputs.substring(2, 3), digitalInput2: binaryInputs.substring(3, 4)};
            result.module2 = {digitalInput1: binaryInputs.substring(4, 5), digitalInput2: binaryInputs.substring(5, 6)};
            result.module3 = {digitalInput1: binaryInputs.substring(6, 7), digitalInput2: binaryInputs.substring(7, 8)};
            result.module4 = {digitalInput1: binaryInputs.substring(8, 9), digitalInput2: binaryInputs.substring(9, 10)};
            result.voltageDetection = { 
                iTR1: binaryInputs.substring(10, 11), 
                iTR2: binaryInputs.substring(11, 12), 
                iTR3: binaryInputs.substring(12, 13), 
                iTR4: binaryInputs.substring(13, 14)  
            };
            
            result.temperatureInput1 = getSigned(hexStr, 40, 42)*0.01;
            result.temperatureInput2 = getSigned(hexStr, 42, 44)*0.01;
            result.temperatureInput3 = getSigned(hexStr, 44, 46)*0.01;

        result.statusChangeCounter = {
                native: {
                    input1: decimalToHex(hexStr[46]).substring(0, 4),
                    input2: decimalToHex(hexStr[46]).substring(4, 8),
                },
                module1: {
                    digitalInput1: decimalToHex(hexStr[47]).substring(0, 4),
                    digitalInput2: decimalToHex(hexStr[47]).substring(4, 8),
                }
            };

            break;
        case 5:
            result.dateTimeOfAvgValue = ((hexStr[4]*16 + hexStr[5])*16 + hexStr[6])*16 + hexStr[7];

            result.load1 = {
                pTotAvg: getSigned(hexStr, 8, 12),
                qTotAvg: getSigned(hexStr, 12, 16),
            };
            result.load2 = {
                pTotAvg: getSigned(hexStr, 16, 20),
                qTotAvg: getSigned(hexStr, 20, 24),
            };
            result.load3 = {
                pTotAvg: getSigned(hexStr, 24, 28),
                qTotAvg: getSigned(hexStr, 28, 32),
            };
            result.load4 = {
                pTotAvg: getSigned(hexStr, 32, 36),
                qTotAvg: getSigned(hexStr, 36, 40),
            };

            var decimalInputs = hexStr[40]*16 + hexStr[41];
            var binaryInputs = decimalToBinary(decimalInputs);

            result.native = {digitalInput1: binaryInputs.substring(0, 1), digitalInput2: binaryInputs.substring(1, 2)};
            result.module1 = {digitalInput1: binaryInputs.substring(2, 3), digitalInput2: binaryInputs.substring(3, 4)};
            result.module2 = {digitalInput1: binaryInputs.substring(4, 5), digitalInput2: binaryInputs.substring(5, 6)};
            result.module3 = {digitalInput1: binaryInputs.substring(6, 7), digitalInput2: binaryInputs.substring(7, 8)};
            result.module4 = {digitalInput1: binaryInputs.substring(8, 9), digitalInput2: binaryInputs.substring(9, 10)};
            result.voltageDetection = { 
                iTR1: binaryInputs.substring(10, 11), 
                iTR2: binaryInputs.substring(11, 12), 
                iTR3: binaryInputs.substring(12, 13), 
                iTR4: binaryInputs.substring(13, 14)  
            };
            
            result.statusChangeCounter = {
                native: {
                    input1: decimalToHex(hexStr[42]).substring(0, 4),
                    input2: decimalToHex(hexStr[42]).substring(4, 8),
                },
                module1: {
                    digitalInput1: decimalToHex(hexStr[43]).substring(0, 4),
                    digitalInput2: decimalToHex(hexStr[43]).substring(4, 8),
                },
                virtualMonitor: {
                    iTR1: decimalToHex(hexStr[44]).substring(0, 4),
                    iTR2: decimalToHex(hexStr[44]).substring(4, 8),
                    iTR3: decimalToHex(hexStr[45]).substring(0, 4),
                    iTR4: decimalToHex(hexStr[45]).substring(4, 8)
                }
            };

            break;
        case 6:
            var flagValue = "";
            switch(hexStr[24]*16 + hexStr[25]){
                case 0:
                    flagValue = "Complete period and date configured";
                    break;
                case 1:
                    flagValue = "Incomplete period and date configured";
                    break;
                case 2:
                    flagValue = "Complete period and date not configured";
                    break;
                case 3:
                    flagValue = "Incomplete period and date not configured";
                    break;
                default:
                    flagValue = "Undecodable";
            }

            result.lastPoint = {
                dateTime: ((hexStr[4]*16 + hexStr[5])*16 + hexStr[6])*16 + hexStr[7],
                "pTot+": ((hexStr[8]*16 + hexStr[9])*16 + hexStr[10])*16 + hexStr[11],
                "pTot-": ((hexStr[12]*16 + hexStr[13])*16 + hexStr[14])*16 + hexStr[15],
                "qTot+": ((hexStr[16]*16 + hexStr[17])*16 + hexStr[18])*16 + hexStr[19],
                "qTot-": ((hexStr[20]*16 + hexStr[21])*16 + hexStr[22])*16 + hexStr[23],
                flag: flagValue
            };

            var flagValue = "";
            switch(hexStr[46]*16 + hexStr[47]){
                case 0:
                    flagValue = "Complete period and date configured";
                    break;
                case 1:
                    flagValue = "Incomplete period and date configured";
                    break;
                case 2:
                    flagValue = "Complete period and date not configured";
                    break;
                case 3:
                    flagValue = "Incomplete period and date not configured";
                    break;
                default:
                    flagValue = "Undecodable";
            }

            result.pointBeforeLast = {
                dateTime: ((hexStr[26]*16 + hexStr[27])*16 + hexStr[28])*16 + hexStr[29],
                "pTot+": ((hexStr[30]*16 + hexStr[31])*16 + hexStr[32])*16 + hexStr[33],
                "pTot-": ((hexStr[34]*16 + hexStr[35])*16 + hexStr[36])*16 + hexStr[37],
                "qTot+": ((hexStr[38]*16 + hexStr[39])*16 + hexStr[40])*16 + hexStr[41],
                "qTot-": ((hexStr[42]*16 + hexStr[43])*16 + hexStr[44])*16 + hexStr[45],
                flag: flagValue
            };

            var decimalInputs = hexStr[48]*16 + hexStr[49];
            var binaryInputs = decimalToBinary(decimalInputs);

            result.native = {digitalInput1: binaryInputs.substring(0, 1), digitalInput2: binaryInputs.substring(1, 2)};
            result.module1 = {digitalInput1: binaryInputs.substring(2, 3), digitalInput2: binaryInputs.substring(3, 4)};
            result.module2 = {digitalInput1: binaryInputs.substring(4, 5), digitalInput2: binaryInputs.substring(5, 6)};
            result.module3 = {digitalInput1: binaryInputs.substring(6, 7), digitalInput2: binaryInputs.substring(7, 8)};
            result.module4 = {digitalInput1: binaryInputs.substring(8, 9), digitalInput2: binaryInputs.substring(9, 10)};
            result.voltageDetection = { 
                iTR1: binaryInputs.substring(10, 11), 
                iTR2: binaryInputs.substring(11, 12), 
                iTR3: binaryInputs.substring(12, 13), 
                iTR4: binaryInputs.substring(13, 14)  
            };
            
            result.statusChangeCounter = {
                native: {
                    input1: decimalToHex(hexStr[50]).substring(0, 4),
                    input2: decimalToHex(hexStr[50]).substring(4, 8),
                },
                module1: {
                    digitalInput1: decimalToHex(hexStr[51]).substring(0, 4),
                    digitalInput2: decimalToHex(hexStr[51]).substring(4, 8),
                }
            };

            break;
        case 7:
            var flagValue = "";
            switch(hexStr[24]*16 + hexStr[25]){
                case 0:
                    flagValue = "Complete period and date configured";
                    break;
                case 1:
                    flagValue = "Incomplete period and date configured";
                    break;
                case 2:
                    flagValue = "Complete period and date not configured";
                    break;
                case 3:
                    flagValue = "Incomplete period and date not configured";
                    break;
                default:
                    flagValue = "Undecodable";
            }

            result.lastPoint = {
                dateTime: ((hexStr[4]*16 + hexStr[5])*16 + hexStr[6])*16 + hexStr[7],
                "load1PTot+": ((hexStr[8]*16 + hexStr[9])*16 + hexStr[10])*16 + hexStr[11],
                "load2PTot+": ((hexStr[12]*16 + hexStr[13])*16 + hexStr[14])*16 + hexStr[15],
                "load3PTot+": ((hexStr[16]*16 + hexStr[17])*16 + hexStr[18])*16 + hexStr[19],
                "load4PTot+": ((hexStr[20]*16 + hexStr[21])*16 + hexStr[22])*16 + hexStr[23],
                flag: flagValue
            };

            var flagValue = "";
            switch(hexStr[46]*16 + hexStr[47]){
                case 0:
                    flagValue = "Complete period and date configured";
                    break;
                case 1:
                    flagValue = "Incomplete period and date configured";
                    break;
                case 2:
                    flagValue = "Complete period and date not configured";
                    break;
                case 3:
                    flagValue = "Incomplete period and date not configured";
                    break;
                default:
                    flagValue = "Undecodable";
            }

            result.pointBeforeLast = {
                dateTime: ((hexStr[26]*16 + hexStr[27])*16 + hexStr[28])*16 + hexStr[29],
                "load1PTot+": ((hexStr[30]*16 + hexStr[31])*16 + hexStr[32])*16 + hexStr[33],
                "load2PTot+": ((hexStr[34]*16 + hexStr[35])*16 + hexStr[36])*16 + hexStr[37],
                "load3PTot+": ((hexStr[38]*16 + hexStr[39])*16 + hexStr[40])*16 + hexStr[41],
                "load4PTot+": ((hexStr[42]*16 + hexStr[43])*16 + hexStr[44])*16 + hexStr[45],
                flag: flagValue
            };

            var decimalInputs = hexStr[48]*16 + hexStr[49];
            var binaryInputs = decimalToBinary(decimalInputs);

            result.native = {digitalInput1: binaryInputs.substring(0, 1), digitalInput2: binaryInputs.substring(1, 2)};
            result.module1 = {digitalInput1: binaryInputs.substring(2, 3), digitalInput2: binaryInputs.substring(3, 4)};
            result.module2 = {digitalInput1: binaryInputs.substring(4, 5), digitalInput2: binaryInputs.substring(5, 6)};
            result.module3 = {digitalInput1: binaryInputs.substring(6, 7), digitalInput2: binaryInputs.substring(7, 8)};
            result.module4 = {digitalInput1: binaryInputs.substring(8, 9), digitalInput2: binaryInputs.substring(9, 10)};
            result.voltageDetection = { 
                iTR1: binaryInputs.substring(10, 11), 
                iTR2: binaryInputs.substring(11, 12), 
                iTR3: binaryInputs.substring(12, 13), 
                iTR4: binaryInputs.substring(13, 14)  
            };
            
            result.statusChangeCounter = {
                native: {
                    input1: decimalToHex(hexStr[50]).substring(0, 4),
                    input2: decimalToHex(hexStr[50]).substring(4, 8),
                },
                module1: {
                    digitalInput1: decimalToHex(hexStr[51]).substring(0, 4),
                    digitalInput2: decimalToHex(hexStr[51]).substring(4, 8),
                }
            };
            
            break;
        default:
            result.errors = ["The payload doesn't have a valid profile number."];
            return result;
    }

    return result;
}

function encodeDownlink(input){
    var result = "";

    return result;
}

exports.decodeUplink = decodeUplink;
exports.encodeDownlink = encodeDownlink;