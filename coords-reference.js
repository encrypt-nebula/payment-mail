// Coordinate estimation based on 1558 x 1010 dimensions of receipt.png

// Image dimensions: Width: 1558, Height: 1010
// Top Header:
// Sanskrit Bharati Malwa Nyas header center: Y ~ 100-200
// Logo Top Left: X: 140-340, Y: 40-230
// Registration No Top Right: X: 1120-1440, Y: 50
// "प्राप्तिपत्रम्" Title: X: 779 (center), Y: 260

// Line 0:
// "क्रमाङ्कः": X: 200, Y: 280-310
// Existing "384" text location: X ~ 340 to 450, Y ~ 265 to 325 (Box to clear: [340, 260, 120, 65])
// New receipt number drawn at X: 360, Y: 305 in red bold (e.g. "३८५")

// "दिनाङ्कः": text starts at X ~ 1140, Y ~ 280
// Date drawn at X: 1240, Y: 280 (on the underline)

// Line 1:
// "श्रीमान् / श्रीमती": label starts at X: 105, Y: 360
// Name drawn at X: 330, Y: 355

// Line 2:
// "पत्रसङ्केतः :": label starts at X: 105, Y: 435
// Address drawn at X: 260, Y: 430

// Line 3:
// "दूरभाषः": label at X: 105, Y: 515. Phone drawn at X: 210, Y: 510
// "Email:": label at X: 540, Y: 515. Email drawn at X: 630, Y: 510
// "PAN": label at X: 1090, Y: 515. PAN drawn at X: 1170, Y: 510

// Line 4:
// "संस्कृतसेवार्थम्": label at X: 105, Y: 595
// Amount Box [ ]: X: 325 to 585, Y: 560 to 625. Amount drawn centered inside box at X: 455, Y: 600
// "अक्षरेषु": label at X: 600, Y: 595. Sanskrit Words drawn at X: 710, Y: 595

// Line 5:
// "रूप्यकाणि / धनादेशः (क्र.": label at X: 105, Y: 685
// Txn / Cheque No drawn at X: 460, Y: 680
// "बैंक": label at X: 680, Y: 685
// Bank Name drawn at X: 750, Y: 680
// ") कृतज्ञतापूर्वकं प्राप्तानि ।": label at X: 960, Y: 685

console.log("Coordinate layout calculated for 1558x1010 canvas.");
