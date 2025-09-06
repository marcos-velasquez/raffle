cronAdd('cleanup-expired-payments', '* * * * *', () => {
  try {
    console.log('🔍 Iniciando limpieza de pagos expirados');
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const fiveMinutesAgoFormatted = fiveMinutesAgo.toISOString().replace('T', ' ').replace('Z', '');
    const filter = `updated != "" && updated >= "${fiveMinutesAgoFormatted}"`;
    const raffles = $app.findRecordsByFilter('raffles', filter);

    let cleanedCount = 0;

    raffles.forEach((raffle) => {
      try {
        console.log('--------- title------', raffle.get('title'), raffle.get('updated'));
        const numbers = JSON.parse(raffle.get('numbers')) || [];
        let hasChanges = false;

        numbers.forEach((number) => {
          console.log('--------- number------', number.state);
          if (number.state === 'inPayment') {
            console.log(
              `🔧 Liberando número ${number.value} de rifa ${raffle.get('title')} (actualizada: ${raffle.get(
                'updated'
              )})`
            );

            number.state = 'available';
            number.payer = { name: '', phone: '', voucher: { id: number.payer.voucher.id, value: '' } };

            hasChanges = true;
            cleanedCount++;
          }
        });

        if (hasChanges) {
          console.log('--------- numbers------', JSON.stringify(numbers));
          raffle.set('numbers', JSON.stringify(numbers));
          $app.save(raffle);
          console.log(`✅ Actualizada rifa: ${raffle.get('title')}`);
        }
      } catch (error) {
        console.error(`❌ Error procesando rifa ${raffle.get('id')}:`, error);
      }
    });

    if (cleanedCount > 0) {
      console.log(`🎯 Limpieza completada: ${cleanedCount} números liberados`);
    } else {
      console.log('✨ No hay números expirados para limpiar');
    }
  } catch (error) {
    console.error('❌ Error en limpieza de pagos expirados:', error);
  }
});
