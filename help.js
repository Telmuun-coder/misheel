export const stockGeneretor = (minut, p30, p60, p120, pp) => {
  if (minut <= 30)
    return [
      {
        code: '001',
        name: 'Park',
        measureUnit: 'Минут',
        qty: minut + '.00',
        unitPrice: (Math.round((p30 / 30) * 100) / 100).toFixed(2),
        totalAmount: (Math.round(p30 * 100) / 100).toFixed(2),
        vat: (Math.round((p30 / 11) * 100) / 100).toFixed(2),
        barCode: '1',
        cityTax: '0.00',
      },
    ];
  else if (minut <= 60)
    return [
      {
        code: '001',
        name: 'Park',
        measureUnit: 'Минут',
        qty: minut + '.00',
        unitPrice: (Math.round((p60 / 60) * 100) / 100).toFixed(2),
        totalAmount: p60 + '.00',
        vat: (Math.round((p60 / 11) * 100) / 100).toFixed(2),
        barCode: '1',
        cityTax: '0.00',
      },
    ];
  else if (minut <= 120)
    return [
      {
        code: '001',
        name: 'Park',
        measureUnit: 'Минут',
        qty: minut + '.00',
        unitPrice: (Math.round((p120 / 120) * 100) / 100).toFixed(2),
        totalAmount: p120 + '.00',
        vat: (Math.round((p120 / 11) * 100) / 100).toFixed(2),
        barCode: '1',
        cityTax: '0.00',
      },
    ];
  else {
    let arr = [
      {
        code: '001',
        name: 'Park',
        measureUnit: 'Минут',
        qty: 120 + '.00',
        unitPrice: (Math.round((p120 / 120) * 100) / 100).toFixed(2),
        totalAmount: p120 + '.00',
        vat: (Math.round((p120 / 11) * 100) / 100).toFixed(2),
        barCode: '1',
        cityTax: '0.00',
      },
    ];
    if (parseFloat((minut - 120) / 60) > 0) {
      let tmp = minut - 120;
      let i = 2;
      while (tmp > 0) {
        arr.push({
          code: '00' + i,
          name: 'Park',
          measureUnit: 'Минут',
          qty: (tmp < 60 ? tmp : 60) + '.00',
          unitPrice: (Math.round((pp / 60) * 100) / 100).toFixed(2),
          totalAmount: pp + '.00',
          vat: (Math.round((pp / 11) * 100) / 100).toFixed(2),
          barCode: '1',
          cityTax: '0.00',
        });
        tmp -= 60;
        i++;
      }
    }

    return arr;
  }
};

// console.log(stockGeneretor(121, 5000, 3000, 2000, 1000));

export const fixJson = (jison) => {
  const regex = /False/gi;
  const regex1 = /True/gi;
  const regex2 = /None/gi;
  let tmp = `"${jison}"`.replace(regex, 'false');
  tmp = `${tmp}`.replace(regex1, 'true');
  tmp = `${tmp}`.replace(regex2, null);
  // console.log(tmp);
  return JSON.parse(tmp.slice(1, tmp.length - 1));
};

export const convertMinuteToTime = (num) => {
  var hours = num / 60;
  var rhours = Math.floor(hours);
  var minutes = (hours - rhours) * 60;
  var rminutes = Math.round(minutes);
  if (rminutes == 0) return rhours + 'цаг';

  return rhours + ' цаг ' + rminutes + ' мин';
};

export const fixQR = (qr) => qr.replace(/\000026/g, '');
