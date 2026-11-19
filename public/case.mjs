const scope = {
  tariffCodes: ['3926201020', '4015110150', '4015190510', '4015190550', '4015191010', '4015191050', '4015195000'],
  manufacturer: 'Top Glove Corporation Bhd',
  country: 'Malaysia'
};

export const gloveCase = {
  title: 'Disposable gloves',
  notices: [
    {
      id: '2021-06393',
      title: 'Forced-labor finding',
      effective: '2021-03-29',
      url: 'https://www.govinfo.gov/content/pkg/FR-2021-03-29/html/2021-06393.htm',
      search: '2021-06393 Top Glove Malaysia March 29 2021 CBP finding',
      summary: 'The finding covers disposable gloves under seven tariff codes, manufactured wholly or in part by Top Glove Corporation Bhd in Malaysia.',
      outcome: 'Review',
      tone: 'review'
    },
    {
      id: '2021-19535',
      title: 'Finding no longer necessary',
      effective: '2021-09-10',
      url: 'https://www.govinfo.gov/content/pkg/FR-2021-09-10/html/2021-19535.htm',
      search: '2021-19535 Top Glove Malaysia September 10 2021 CBP determination',
      summary: 'The determination applies to merchandise covered by the finding that was imported on or after September 10, 2021.',
      outcome: 'Finding lifted',
      tone: 'lifted'
    }
  ],
  scope,
  orders: [
    { id: 'PO-1042', product: 'Disposable examination gloves', code: '4015190510', vendor: 'Sample Medical Supply', manufacturer: scope.manufacturer, country: scope.country, importDate: '2021-09-20' },
    { id: 'PO-1043', product: 'Disposable examination gloves', code: '4015190510', vendor: 'Sample Clinical Distributors', manufacturer: '', country: '', importDate: '2021-09-22' },
    { id: 'PO-1044', product: 'Disposable face masks', code: '6307909845', vendor: 'Sample Clinical Distributors', manufacturer: '', country: '', importDate: '2021-09-23' }
  ]
};

export function reviewOrder(order, reviewDate, investigation) {
  const { scope, notices } = investigation;
  const published = notices.filter(notice => notice.effective <= reviewDate);
  const applicable = published.findLast(notice => notice.effective <= order.importDate);
  const reference = applicable ?? published.at(-1);
  if (!reference) return { status: 'Before finding', tone: 'outside', reason: 'The finding had yet to be published on the selected review date.' };

  if (order.code && !scope.tariffCodes.includes(order.code) ||
      order.manufacturer && order.manufacturer !== scope.manufacturer ||
      order.country && order.country !== scope.country) {
    return { status: 'Outside scope', tone: 'outside', notice: reference, reason: 'The recorded tariff code, manufacturer, or production country falls outside this finding.' };
  }

  if (!order.code || !order.manufacturer || !order.country || !order.importDate) {
    const missing = [
      !order.code && 'tariff code',
      !order.manufacturer && 'manufacturer',
      !order.country && 'production facility and country',
      !order.importDate && 'import date'
    ].filter(Boolean);
    return { status: 'Evidence needed', tone: 'missing', notice: reference, reason: 'Request the ' + missing.join(', ') + ' for this lot.' };
  }

  if (!applicable) return { status: 'Outside scope', tone: 'outside', notice: reference, reason: 'This import predates the finding.' };

  return {
    status: applicable.outcome,
    tone: applicable.tone,
    notice: applicable,
    reason: applicable.tone === 'lifted'
      ? 'This sample order matches the product and manufacturer scope. Its import date falls on or after the September determination took effect.'
      : 'The sample order matches the tariff code, manufacturer, and country in the finding as of the selected review date.'
  };
}
