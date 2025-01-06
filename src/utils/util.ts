export function indexToLetter(num: number){
  let ltr = "";

  if(num == 0){
    ltr = "A";
  }

  while(num > 0){
    const last = num % 26;
    ltr = String.fromCharCode(65 + last - (ltr.length > 0? 1: 0)) + ltr;
    num = Math.floor(num / 26);
  }

  return ltr;
}

export function letterToIndex(ltr: string){
  ltr = ltr.toUpperCase();

  let num = 0;
  for(let i = 0; i < ltr.length; i++){
    const pos = ltr.charCodeAt(ltr.length - 1 - i) - 65 + 1;
    num += pos * Math.pow(26, i);
  }

  return num - 1;
}