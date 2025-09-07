cronAdd('cleanup-expired-payments', '* * * * *', () => {
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString().replace('T', ' ').replace('Z', '');
  const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);

  $app.findRecordsByFilter('raffles', `updated != "" && updated >= "${fiveMinutesAgo}"`).forEach((raffle) => {
    if (new Date(raffle.get('updated')) > twoMinutesAgo) return;

    const numbers = JSON.parse(raffle.get('numbers') || '[]');
    let hasChanges = false;

    numbers.forEach((number) => {
      if (number.state === 'inPayment') {
        number.state = 'available';
        number.payer = { name: '', phone: '', voucher: { id: number.payer.voucher.id, value: '' } };
        hasChanges = true;
      }
    });

    if (hasChanges) {
      raffle.set('numbers', JSON.stringify(numbers));
      $app.save(raffle);
    }
  });
});
