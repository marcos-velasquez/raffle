cronAdd('cleanup-expired-payments', '* * * * *', () => {
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString().replace('T', ' ').replace('Z', '');
  const filter = `updated != "" && updated >= "${fiveMinutesAgo}"`;
  const raffles = $app.findRecordsByFilter('raffles', filter);

  let hasChanges = false;

  raffles.forEach((raffle) => {
    const numbers = JSON.parse(raffle.get('numbers')) || [];

    numbers.forEach((number) => {
      if (number.state === 'inPayment') {
        const raffleUpdated = new Date(raffle.get('updated'));
        const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);

        if (raffleUpdated <= twoMinutesAgo) {
          number.state = 'available';
          number.payer = { name: '', phone: '', voucher: { id: number.payer.voucher.id, value: '' } };
          hasChanges = true;
        }
      }
    });

    if (hasChanges) {
      raffle.set('numbers', JSON.stringify(numbers));
      $app.save(raffle);
    }
  });
});
