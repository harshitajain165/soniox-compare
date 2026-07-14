export type CompareTtsSampleType =
  | "appointment"
  | "delivery"
  | "billing"
  | "contact";

export interface CompareTtsSample {
  type: CompareTtsSampleType;
  label: string;
  text: string;
}

export interface CompareTtsLanguageSamples {
  language: string;
  samples: CompareTtsSample[];
}

export const TTS_SAMPLES: Record<string, CompareTtsSample[]> = {
  // Afrikaans
  af: [
    {
      type: "appointment",
      label: "Appointment example",
      text: "Jou afspraak met Dr. Alexander Chen is bevestig vir Dinsdag, 15 Maart 2026 om 15:30. Bel +27-11-123-4567 om te herbeplan.",
    },
    {
      type: "delivery",
      label: "Delivery example",
      text: "Jou bestelling SXN-7H3-KQ9 sal afgelewer word by Kerkstraat 128, Kaapstad 8001 tussen 09:00 en 17:30. Opsporing UPS-1Z999AA10.",
    },
    {
      type: "billing",
      label: "Billing example",
      text: "Jou saldo van R 24,500.00 is betaalbaar op 15 Maart 2026, met 'n 2.5% laat fooi na 30 dae. Kwitansies gestuur na j.patel@clinic-health.co.uk.",
    },
    {
      type: "contact",
      label: "Contact example",
      text: "Bevestig asseblief jou kontakbesonderhede: Yuki Takahashi, selfoon +27-82-555-0142, e-pos fatima.al-rashid@example.co.uk.",
    },
  ],
  // Albanian
  sq: [
    {
      type: "appointment",
      label: "Appointment example",
      text: "Takimi juaj me Dr. Alexander Chen është konfirmuar të martën, 15 mars 2026, në orën 15:30. Telefononi +355-4-123-4567 për të rregulluar orarin.",
    },
    {
      type: "delivery",
      label: "Delivery example",
      text: "Porosia juaj SXN-7H3-KQ9 do të mbërrijë në Rr. Myslym Shyri 42, 1001 Tiranë mes orës 09:00 dhe 17:30. Ndjekja UPS-1Z999AA10.",
    },
    {
      type: "billing",
      label: "Billing example",
      text: "Fatura juaj prej 125.000 lekë duhet paguar më 15 mars 2026, me një kamatë vonese prej 2,5 % pas 30 ditësh. Faturat janë dërguar në j.patel@clinic-health.co.uk.",
    },
    {
      type: "contact",
      label: "Contact example",
      text: "Ju lutemi konfirmoni të dhënat e kontaktit: Yuki Takahashi, celular +355-69-555-0142, email fatima.al-rashid@example.co.uk.",
    },
  ],
  // Arabic
  ar: [
    {
      type: "appointment",
      label: "Appointment example",
      text: "تم تأكيد موعدك مع الدكتور Alexander Chen يوم الثلاثاء 15 مارس 2026 الساعة 3:30 مساءً. اتصل على +966-11-123-4567 لإعادة جدولته.",
    },
    {
      type: "delivery",
      label: "Delivery example",
      text: "سيصل طلبك SXN-7H3-KQ9 إلى شارع العليا 2250، الرياض 12214 بين الساعة 9:00 صباحاً و 5:30 مساءً. رقم التتبع UPS-1Z999AA10.",
    },
    {
      type: "billing",
      label: "Billing example",
      text: "فاتورتك بقيمة 4,875 ريال مستحقة في 15 مارس 2026، مع غرامة تأخير 2.5% بعد 30 يوماً. تم إرسال الإيصالات إلى j.patel@clinic-health.co.uk.",
    },
    {
      type: "contact",
      label: "Contact example",
      text: "يرجى تأكيد بيانات الاتصال: Yuki Takahashi، جوال +966-50-555-0142، بريد إلكتروني fatima.al-rashid@example.co.uk.",
    },
  ],
  // Azerbaijani
  az: [
    {
      type: "appointment",
      label: "Appointment example",
      text: "Dr. Alexander Chen ilə görüşünüz 15 mart 2026-cı il çərşənbə axşamı saat 15:30-a təsdiqləndi. Yenidən təyin etmək üçün +994-12-123-45-67 nömrəsinə zəng edin.",
    },
    {
      type: "delivery",
      label: "Delivery example",
      text: "SXN-7H3-KQ9 sifarişiniz Nizami küç. 42, Bakı AZ1000 ünvanına saat 09:00 ilə 17:30 arasında çatdırılacaq. İzləmə UPS-1Z999AA10.",
    },
    {
      type: "billing",
      label: "Billing example",
      text: "2.450 ₼ məbləğindəki hesabınız 15 mart 2026-cı ildə ödənilməlidir, 30 gündən sonra 2,5% gecikmə cəriməsi tətbiq olunur. Qəbzlər j.patel@clinic-health.co.uk ünvanına göndərildi.",
    },
    {
      type: "contact",
      label: "Contact example",
      text: "Zəhmət olmasa əlaqə məlumatlarınızı təsdiqləyin: Yuki Takahashi, mobil +994-50-555-0142, e-poçt fatima.al-rashid@example.co.uk.",
    },
  ],
  // Basque
  eu: [
    {
      type: "appointment",
      label: "Appointment example",
      text: "Alexander Chen doktorearekin duzun hitzordua 2026ko martxoaren 15ean, asteartean, 15:30ean baieztatu da. Deitu +34-94-123-4567 telefonora berriz antolatzeko.",
    },
    {
      type: "delivery",
      label: "Delivery example",
      text: "Zure SXN-7H3-KQ9 eskaera Gran Via 24, 48001 Bilbo helbidera iritsiko da 09:00 eta 17:30 artean. Jarraipena UPS-1Z999AA10.",
    },
    {
      type: "billing",
      label: "Billing example",
      text: "Zure 1.299,50 €-ko faktura 2026ko martxoaren 15ean mugaeguneratuko da, eta %2,5eko berandutza interesa aplikatuko da 30 egun ondoren. Ordainagiriak j.patel@clinic-health.co.uk helbidera bidali dira.",
    },
    {
      type: "contact",
      label: "Contact example",
      text: "Mesedez, berretsi zure harremanetarako datuak: Yuki Takahashi, mugikorra +34-688-555-142, e-posta fatima.al-rashid@example.co.uk.",
    },
  ],
  // Belarusian
  be: [
    {
      type: "appointment",
      label: "Appointment example",
      text: "Ваш прыём у доктара Alexander Chen пацверджаны на аўторак, 15 сакавіка 2026 года, у 15:30. Патэлефануйце па +375-17-123-45-67, каб перанесці.",
    },
    {
      type: "delivery",
      label: "Delivery example",
      text: "Ваша замова SXN-7H3-KQ9 будзе дастаўлена па адрасе вул. Нямiга 10, 220030 Мінск з 09:00 да 17:30. Адсочванне UPS-1Z999AA10.",
    },
    {
      type: "billing",
      label: "Billing example",
      text: "Ваш рахунак на суму 3.250,00 Br падлягае аплаце 15 сакавіка 2026 года, з пеней 2,5% пасля 30 дзён. Квітанцыі адпраўлены на j.patel@clinic-health.co.uk.",
    },
    {
      type: "contact",
      label: "Contact example",
      text: "Калі ласка, пацвердзіце кантактныя дадзеныя: Yuki Takahashi, мабільны +375-29-555-0142, электронная пошта fatima.al-rashid@example.co.uk.",
    },
  ],
  // Bengali
  bn: [
    {
      type: "appointment",
      label: "Appointment example",
      text: "ডঃ Alexander Chen এর সাথে আপনার অ্যাপয়েন্টমেন্ট মঙ্গলবার, 15 মার্চ 2026, বিকাল 3:30 টায় নিশ্চিত করা হয়েছে। পুনঃনির্ধারণের জন্য +880-2-1234-5678 নম্বরে কল করুন।",
    },
    {
      type: "delivery",
      label: "Delivery example",
      text: "আপনার অর্ডার SXN-7H3-KQ9 গুলশান অ্যাভিনিউ 42, ঢাকা 1212 ঠিকানায় সকাল 9:00 থেকে বিকাল 5:30 এর মধ্যে পৌঁছাবে। ট্র্যাকিং UPS-1Z999AA10।",
    },
    {
      type: "billing",
      label: "Billing example",
      text: "আপনার ৳142,500 টাকার চালান 15 মার্চ 2026 তারিখে পরিশোধযোগ্য, 30 দিন পর 2.5% বিলম্ব ফি প্রযোজ্য হবে। রসিদগুলি j.patel@clinic-health.co.uk-এ পাঠানো হয়েছে।",
    },
    {
      type: "contact",
      label: "Contact example",
      text: "অনুগ্রহ করে আপনার যোগাযোগের বিবরণ নিশ্চিত করুন: Yuki Takahashi, মোবাইল +880-17-555-0142, ইমেইল fatima.al-rashid@example.co.uk।",
    },
  ],
  // Bosnian
  bs: [
    {
      type: "appointment",
      label: "Appointment example",
      text: "Vaš pregled kod dr. Alexander Chen potvrđen je za utorak, 15. marta 2026. u 15:30. Nazovite +387-33-123-456 za promjenu termina.",
    },
    {
      type: "delivery",
      label: "Delivery example",
      text: "Vaša narudžba SXN-7H3-KQ9 stići će na adresu Ferhadija 18, 71000 Sarajevo između 09:00 i 17:30. Praćenje UPS-1Z999AA10.",
    },
    {
      type: "billing",
      label: "Billing example",
      text: "Vaš račun u iznosu od 2.450,00 KM dospijeva 15. marta 2026, uz zateznu kamatu od 2,5% nakon 30 dana. Potvrde su poslane na j.patel@clinic-health.co.uk.",
    },
    {
      type: "contact",
      label: "Contact example",
      text: "Molimo potvrdite kontakt podatke: Yuki Takahashi, mobitel +387-61-555-0142, email fatima.al-rashid@example.co.uk.",
    },
  ],
  // Bulgarian
  bg: [
    {
      type: "appointment",
      label: "Appointment example",
      text: "Вашият час при д-р Alexander Chen е потвърден за вторник, 15 март 2026 г., в 15:30 ч. Обадете се на +359-2-123-4567, за да го пренасрочите.",
    },
    {
      type: "delivery",
      label: "Delivery example",
      text: "Вашата поръчка SXN-7H3-KQ9 ще бъде доставена на бул. Витоша 45, 1000 София между 09:00 и 17:30 ч. Проследяване UPS-1Z999AA10.",
    },
    {
      type: "billing",
      label: "Billing example",
      text: "Вашата фактура за 2 450,00 лв. е с падеж 15 март 2026 г., с лихва за забавяне от 2,5% след 30 дни. Разписките са изпратени на j.patel@clinic-health.co.uk.",
    },
    {
      type: "contact",
      label: "Contact example",
      text: "Моля, потвърдете данните за контакт: Yuki Takahashi, мобилен +359-88-555-0142, имейл fatima.al-rashid@example.co.uk.",
    },
  ],
  // Catalan
  ca: [
    {
      type: "appointment",
      label: "Appointment example",
      text: "La vostra visita amb el Dr. Alexander Chen està confirmada per dimarts, 15 de març de 2026, a les 15:30. Truqueu al +34-93-123-4567 per canviar l'hora.",
    },
    {
      type: "delivery",
      label: "Delivery example",
      text: "La vostra comanda SXN-7H3-KQ9 arribarà al Carrer de Balmes 120, 08008 Barcelona entre les 09:00 i les 17:30. Seguiment UPS-1Z999AA10.",
    },
    {
      type: "billing",
      label: "Billing example",
      text: "La vostra factura de 1.299,50 € venç el 15 de març de 2026, amb un recàrrec del 2,5% després de 30 dies. S'han enviat els rebuts a j.patel@clinic-health.co.uk.",
    },
    {
      type: "contact",
      label: "Contact example",
      text: "Si us plau, confirmeu les vostres dades de contacte: Yuki Takahashi, mòbil +34-688-555-142, correu fatima.al-rashid@example.co.uk.",
    },
  ],
  // Chinese
  zh: [
    {
      type: "appointment",
      label: "Appointment example",
      text: "您与 Alexander Chen 医生的预约已确认，时间为 2026年3月15日 星期二 下午3:30。如需改期，请致电 +86-10-1234-5678。",
    },
    {
      type: "delivery",
      label: "Delivery example",
      text: "您的订单 SXN-7H3-KQ9 将于上午9:00至下午5:30之间送达北京市朝阳区建国路88号，邮编100022。快递追踪号 UPS-1Z999AA10。",
    },
    {
      type: "billing",
      label: "Billing example",
      text: "您 ¥9,280.50 的账单将于 2026年3月15日 到期，逾期30天将收取 2.5% 的滞纳金。收据已发送至 j.patel@clinic-health.co.uk。",
    },
    {
      type: "contact",
      label: "Contact example",
      text: "请确认您的联系方式：Yuki Takahashi，手机 +86-138-0013-8000，邮箱 fatima.al-rashid@example.co.uk。",
    },
  ],
  // Croatian
  hr: [
    {
      type: "appointment",
      label: "Appointment example",
      text: "Vaš pregled kod dr. Alexander Chen potvrđen je za utorak, 15. ožujka 2026. u 15:30. Nazovite +385-1-1234-567 za promjenu termina.",
    },
    {
      type: "delivery",
      label: "Delivery example",
      text: "Vaša narudžba SXN-7H3-KQ9 stići će na adresu Ilica 42, 10000 Zagreb između 09:00 i 17:30 sati. Praćenje UPS-1Z999AA10.",
    },
    {
      type: "billing",
      label: "Billing example",
      text: "Vaš račun od 1.299,50 € dospijeva 15. ožujka 2026, uz zateznu kamatu od 2,5% nakon 30 dana. Potvrde su poslane na j.patel@clinic-health.co.uk.",
    },
    {
      type: "contact",
      label: "Contact example",
      text: "Molimo potvrdite svoje kontakt podatke: Yuki Takahashi, mobitel +385-91-555-0142, e-pošta fatima.al-rashid@example.co.uk.",
    },
  ],
  // Czech
  cs: [
    {
      type: "appointment",
      label: "Appointment example",
      text: "Vaše návštěva u dr. Alexander Chen je potvrzena na úterý 15. března 2026 v 15:30. Pro změnu termínu volejte +420-2-1234-5678.",
    },
    {
      type: "delivery",
      label: "Delivery example",
      text: "Vaše objednávka SXN-7H3-KQ9 bude doručena na adresu Václavské nám. 28, 110 00 Praha 1 mezi 09:00 a 17:30. Sledování UPS-1Z999AA10.",
    },
    {
      type: "billing",
      label: "Billing example",
      text: "Vaše faktura ve výši 32 450,00 Kč je splatná 15. března 2026, s úrokem z prodlení 2,5 % po 30 dnech. Účtenky byly zaslány na j.patel@clinic-health.co.uk.",
    },
    {
      type: "contact",
      label: "Contact example",
      text: "Prosím potvrďte své kontaktní údaje: Yuki Takahashi, mobil +420-602-555-142, e-mail fatima.al-rashid@example.co.uk.",
    },
  ],
  // Danish
  da: [
    {
      type: "appointment",
      label: "Appointment example",
      text: "Din aftale med dr. Alexander Chen er bekræftet til tirsdag den 15. marts 2026 kl. 15:30. Ring til +45-33-12-34-56 for at ombooke.",
    },
    {
      type: "delivery",
      label: "Delivery example",
      text: "Din ordre SXN-7H3-KQ9 leveres på Nørrebrogade 42, 2200 København N mellem kl. 09:00 og 17:30. Sporing UPS-1Z999AA10.",
    },
    {
      type: "billing",
      label: "Billing example",
      text: "Din faktura på 9.450,00 kr. forfalder den 15. marts 2026, med en morarente på 2,5% efter 30 dage. Kvitteringer er sendt til j.patel@clinic-health.co.uk.",
    },
    {
      type: "contact",
      label: "Contact example",
      text: "Bekræft venligst dine kontaktoplysninger: Yuki Takahashi, mobil +45-20-55-01-42, e-mail fatima.al-rashid@example.co.uk.",
    },
  ],
  // Dutch
  nl: [
    {
      type: "appointment",
      label: "Appointment example",
      text: "Uw afspraak met dr. Alexander Chen is bevestigd voor dinsdag 15 maart 2026 om 15:30. Bel +31-20-123-4567 om te verzetten.",
    },
    {
      type: "delivery",
      label: "Delivery example",
      text: "Uw bestelling SXN-7H3-KQ9 wordt bezorgd op Herengracht 128, 1015 BT Amsterdam tussen 09:00 en 17:30 uur. Tracering UPS-1Z999AA10.",
    },
    {
      type: "billing",
      label: "Billing example",
      text: "Uw factuur van € 1.299,50 vervalt op 15 maart 2026, met een vertragingsrente van 2,5% na 30 dagen. Bonnen zijn verstuurd naar j.patel@clinic-health.co.uk.",
    },
    {
      type: "contact",
      label: "Contact example",
      text: "Bevestig alstublieft uw contactgegevens: Yuki Takahashi, mobiel +31-6-5555-0142, e-mail fatima.al-rashid@example.co.uk.",
    },
  ],
  // English
  en: [
    {
      type: "appointment",
      label: "Appointment example",
      text: "Your appointment with Dr. Alexander Chen is confirmed for Tuesday, March 15, 2026 at 3:30 PM. Call +1-800-555-0199 to reschedule.",
    },
    {
      type: "delivery",
      label: "Delivery example",
      text: "Your order SXN-7H3-KQ9 will arrive at 4250 Harrison Blvd., San Francisco, CA 94103 between 9:00 AM and 5:30 PM. Tracking UPS-1Z999AA10.",
    },
    {
      type: "billing",
      label: "Billing example",
      text: "Your balance of $1,299.50 is due March 15, 2026, with a 2.5% late fee after 30 days. Receipts sent to j.patel@clinic-health.co.uk.",
    },
    {
      type: "contact",
      label: "Contact example",
      text: "Please confirm your contact details: Yuki Takahashi, mobile +1-415-555-0142, email fatima.al-rashid@example.co.uk.",
    },
  ],
  // Estonian
  et: [
    {
      type: "appointment",
      label: "Appointment example",
      text: "Teie vastuvõtt dr. Alexander Chen juures on kinnitatud teisipäeval, 15. märtsil 2026 kell 15:30. Aja muutmiseks helistage +372-6-123-456.",
    },
    {
      type: "delivery",
      label: "Delivery example",
      text: "Teie tellimus SXN-7H3-KQ9 saabub aadressile Viru tn 12, 10140 Tallinn kella 09:00 ja 17:30 vahel. Jälgimisnumber UPS-1Z999AA10.",
    },
    {
      type: "billing",
      label: "Billing example",
      text: "Teie arve summas 1 299,50 € tuleb tasuda 15. märtsil 2026, viivis 2,5% rakendub 30 päeva pärast. Kviitungid on saadetud aadressile j.patel@clinic-health.co.uk.",
    },
    {
      type: "contact",
      label: "Contact example",
      text: "Palun kinnitage oma kontaktandmed: Yuki Takahashi, mobiil +372-5-555-0142, e-post fatima.al-rashid@example.co.uk.",
    },
  ],
  // Finnish
  fi: [
    {
      type: "appointment",
      label: "Appointment example",
      text: "Tapaamisesi tohtori Alexander Chenin kanssa on vahvistettu tiistaina 15. maaliskuuta 2026 klo 15:30. Soita numeroon +358-9-123-4567 siirtääksesi aikaa.",
    },
    {
      type: "delivery",
      label: "Delivery example",
      text: "Tilauksesi SXN-7H3-KQ9 toimitetaan osoitteeseen Mannerheimintie 42, 00100 Helsinki klo 09:00–17:30 välillä. Seuranta UPS-1Z999AA10.",
    },
    {
      type: "billing",
      label: "Billing example",
      text: "Laskusi 1 299,50 € erääntyy 15. maaliskuuta 2026, ja 30 päivän jälkeen peritään 2,5 % viivästyskorko. Kuitit on lähetetty osoitteeseen j.patel@clinic-health.co.uk.",
    },
    {
      type: "contact",
      label: "Contact example",
      text: "Vahvista yhteystietosi: Yuki Takahashi, matkapuhelin +358-40-555-0142, sähköposti fatima.al-rashid@example.co.uk.",
    },
  ],
  // French
  fr: [
    {
      type: "appointment",
      label: "Appointment example",
      text: "Votre rendez-vous avec le Dr Alexander Chen est confirmé pour le mardi 15 mars 2026 à 15h30. Appelez le +33-1-23-45-67-89 pour le reporter.",
    },
    {
      type: "delivery",
      label: "Delivery example",
      text: "Votre commande SXN-7H3-KQ9 sera livrée au 42 rue de Rivoli, 75004 Paris entre 9h00 et 17h30. Suivi UPS-1Z999AA10.",
    },
    {
      type: "billing",
      label: "Billing example",
      text: "Votre facture de 1 299,50 € est due le 15 mars 2026, avec des pénalités de 2,5 % après 30 jours. Les reçus ont été envoyés à j.patel@clinic-health.co.uk.",
    },
    {
      type: "contact",
      label: "Contact example",
      text: "Merci de confirmer vos coordonnées : Yuki Takahashi, mobile +33-6-12-34-56-78, e-mail fatima.al-rashid@example.co.uk.",
    },
  ],
  // Galician
  gl: [
    {
      type: "appointment",
      label: "Appointment example",
      text: "A súa cita co Dr. Alexander Chen está confirmada para o martes, 15 de marzo de 2026, ás 15:30. Chame ao +34-98-123-4567 para cambiala.",
    },
    {
      type: "delivery",
      label: "Delivery example",
      text: "O seu pedido SXN-7H3-KQ9 chegará á Rúa do Vilar 24, 15705 Santiago de Compostela entre as 09:00 e as 17:30. Seguimento UPS-1Z999AA10.",
    },
    {
      type: "billing",
      label: "Billing example",
      text: "A súa factura de 1.299,50 € vence o 15 de marzo de 2026, cunha recarga do 2,5% despois de 30 días. Os recibos enviáronse a j.patel@clinic-health.co.uk.",
    },
    {
      type: "contact",
      label: "Contact example",
      text: "Confirme os seus datos de contacto: Yuki Takahashi, móbil +34-688-555-142, correo fatima.al-rashid@example.co.uk.",
    },
  ],
  // German
  de: [
    {
      type: "appointment",
      label: "Appointment example",
      text: "Ihr Termin bei Dr. Alexander Chen ist für Dienstag, den 15. März 2026 um 15:30 Uhr bestätigt. Rufen Sie +49-30-12345678 an, um den Termin zu verschieben.",
    },
    {
      type: "delivery",
      label: "Delivery example",
      text: "Ihre Bestellung SXN-7H3-KQ9 wird zwischen 09:00 und 17:30 Uhr in der Friedrichstr. 42, 10117 Berlin zugestellt. Sendungsnummer UPS-1Z999AA10.",
    },
    {
      type: "billing",
      label: "Billing example",
      text: "Ihre Rechnung über 1.299,50 € ist am 15. März 2026 fällig, mit einer Mahngebühr von 2,5 % nach 30 Tagen. Quittungen wurden an j.patel@clinic-health.co.uk gesendet.",
    },
    {
      type: "contact",
      label: "Contact example",
      text: "Bitte bestätigen Sie Ihre Kontaktdaten: Yuki Takahashi, Mobil +49-171-5550142, E-Mail fatima.al-rashid@example.co.uk.",
    },
  ],
  // Greek
  el: [
    {
      type: "appointment",
      label: "Appointment example",
      text: "Το ραντεβού σας με τον Δρ. Alexander Chen επιβεβαιώνεται για την Τρίτη, 15 Μαρτίου 2026, στις 15:30. Καλέστε στο +30-21-1234-5678 για επαναπρογραμματισμό.",
    },
    {
      type: "delivery",
      label: "Delivery example",
      text: "Η παραγγελία σας SXN-7H3-KQ9 θα παραδοθεί στην οδό Ερμού 42, 10563 Αθήνα μεταξύ 09:00 και 17:30. Παρακολούθηση UPS-1Z999AA10.",
    },
    {
      type: "billing",
      label: "Billing example",
      text: "Το τιμολόγιό σας ύψους 1.299,50 € λήγει στις 15 Μαρτίου 2026, με τόκο υπερημερίας 2,5% μετά από 30 ημέρες. Οι αποδείξεις έχουν σταλεί στο j.patel@clinic-health.co.uk.",
    },
    {
      type: "contact",
      label: "Contact example",
      text: "Παρακαλούμε επιβεβαιώστε τα στοιχεία επικοινωνίας σας: Yuki Takahashi, κινητό +30-69-5555-0142, email fatima.al-rashid@example.co.uk.",
    },
  ],
  // Gujarati
  gu: [
    {
      type: "appointment",
      label: "Appointment example",
      text: "ડૉ. Alexander Chen સાથે તમારી એપોઇન્ટમેન્ટ મંગળવાર, 15 માર્ચ 2026 ના રોજ સાંજે 3:30 વાગ્યે પુષ્ટિ થઈ છે. ફરીથી શેડ્યૂલ કરવા માટે +91-79-1234-5678 પર કોલ કરો.",
    },
    {
      type: "delivery",
      label: "Delivery example",
      text: "તમારો ઓર્ડર SXN-7H3-KQ9 સીજી રોડ 42, અમદાવાદ 380006 ખાતે સવારે 9:00 અને સાંજે 5:30 વચ્ચે પહોંચશે. ટ્રેકિંગ UPS-1Z999AA10.",
    },
    {
      type: "billing",
      label: "Billing example",
      text: "તમારું ₹1,08,450 નું બિલ 15 માર્ચ 2026 ના રોજ બાકી છે, 30 દિવસ પછી 2.5% વિલંબ ફી લાગુ થશે. રસીદો j.patel@clinic-health.co.uk પર મોકલવામાં આવી છે.",
    },
    {
      type: "contact",
      label: "Contact example",
      text: "કૃપા કરીને તમારી સંપર્ક વિગતો પુષ્ટિ કરો: Yuki Takahashi, મોબાઇલ +91-98250-55142, ઇમેઇલ fatima.al-rashid@example.co.uk.",
    },
  ],
  // Hebrew
  he: [
    {
      type: "appointment",
      label: "Appointment example",
      text: 'התור שלך אצל ד"ר Alexander Chen אושר ליום שלישי, 15 במרץ 2026, בשעה 15:30. התקשרו ל-+972-3-123-4567 כדי לקבוע מחדש.',
    },
    {
      type: "delivery",
      label: "Delivery example",
      text: "ההזמנה שלך SXN-7H3-KQ9 תגיע לרח' דיזנגוף 128, תל אביב 6433401 בין השעות 09:00 ל-17:30. מעקב UPS-1Z999AA10.",
    },
    {
      type: "billing",
      label: "Billing example",
      text: "החשבונית שלך על סך ₪4,850 תיפרע ב-15 במרץ 2026, עם ריבית פיגורים של 2.5% לאחר 30 ימים. הקבלות נשלחו ל-j.patel@clinic-health.co.uk.",
    },
    {
      type: "contact",
      label: "Contact example",
      text: 'נא לאשר את פרטי הקשר: Yuki Takahashi, נייד +972-52-555-0142, דוא"ל fatima.al-rashid@example.co.uk.',
    },
  ],
  // Hindi
  hi: [
    {
      type: "appointment",
      label: "Appointment example",
      text: "डॉ. Alexander Chen के साथ आपकी अपॉइंटमेंट मंगलवार, 15 मार्च 2026 को शाम 3:30 बजे की पुष्टि हो गई है। पुनर्निर्धारण के लिए +91-11-1234-5678 पर कॉल करें।",
    },
    {
      type: "delivery",
      label: "Delivery example",
      text: "आपका ऑर्डर SXN-7H3-KQ9 कनॉट प्लेस 42, नई दिल्ली 110001 पर सुबह 9:00 और शाम 5:30 के बीच पहुंचेगा। ट्रैकिंग UPS-1Z999AA10।",
    },
    {
      type: "billing",
      label: "Billing example",
      text: "आपका ₹1,08,450 का बिल 15 मार्च 2026 को देय है, 30 दिनों के बाद 2.5% विलंब शुल्क लागू होगा। रसीदें j.patel@clinic-health.co.uk पर भेजी गई हैं।",
    },
    {
      type: "contact",
      label: "Contact example",
      text: "कृपया अपने संपर्क विवरण की पुष्टि करें: Yuki Takahashi, मोबाइल +91-98100-55142, ईमेल fatima.al-rashid@example.co.uk।",
    },
  ],
  // Hungarian
  hu: [
    {
      type: "appointment",
      label: "Appointment example",
      text: "Időpontja Dr. Alexander Chennél 2026. március 15-én, kedden 15:30-ra van megerősítve. Új időpont egyeztetéséhez hívja a +36-1-123-4567 számot.",
    },
    {
      type: "delivery",
      label: "Delivery example",
      text: "Az SXN-7H3-KQ9 rendelése 09:00 és 17:30 között érkezik a Váci utca 42., 1052 Budapest címre. Nyomkövetés UPS-1Z999AA10.",
    },
    {
      type: "billing",
      label: "Billing example",
      text: "Az Ön 485 000 Ft összegű számlája 2026. március 15-én esedékes, 30 nap után 2,5% késedelmi kamat érvényes. A bizonylatokat a j.patel@clinic-health.co.uk címre küldtük.",
    },
    {
      type: "contact",
      label: "Contact example",
      text: "Kérjük, erősítse meg elérhetőségeit: Yuki Takahashi, mobil +36-20-555-0142, e-mail fatima.al-rashid@example.co.uk.",
    },
  ],
  // Indonesian
  id: [
    {
      type: "appointment",
      label: "Appointment example",
      text: "Janji temu Anda dengan Dr. Alexander Chen telah dikonfirmasi untuk Selasa, 15 Maret 2026, pukul 15:30. Hubungi +62-21-1234-5678 untuk menjadwalkan ulang.",
    },
    {
      type: "delivery",
      label: "Delivery example",
      text: "Pesanan Anda SXN-7H3-KQ9 akan tiba di Jl. Sudirman No. 42, Jakarta Pusat 10220 antara pukul 09:00 dan 17:30. Pelacakan UPS-1Z999AA10.",
    },
    {
      type: "billing",
      label: "Billing example",
      text: "Faktur Anda sebesar Rp 18.500.000 jatuh tempo pada 15 Maret 2026, dengan denda keterlambatan 2,5% setelah 30 hari. Kwitansi dikirim ke j.patel@clinic-health.co.uk.",
    },
    {
      type: "contact",
      label: "Contact example",
      text: "Mohon konfirmasi detail kontak Anda: Yuki Takahashi, ponsel +62-812-5555-0142, email fatima.al-rashid@example.co.uk.",
    },
  ],
  // Italian
  it: [
    {
      type: "appointment",
      label: "Appointment example",
      text: "Il Suo appuntamento con il Dr. Alexander Chen è confermato per martedì 15 marzo 2026 alle ore 15:30. Chiami il +39-06-1234-5678 per riprogrammarlo.",
    },
    {
      type: "delivery",
      label: "Delivery example",
      text: "Il Suo ordine SXN-7H3-KQ9 sarà consegnato in Via del Corso 42, 00186 Roma tra le 09:00 e le 17:30. Tracciamento UPS-1Z999AA10.",
    },
    {
      type: "billing",
      label: "Billing example",
      text: "La Sua fattura di 1.299,50 € scade il 15 marzo 2026, con una mora del 2,5% dopo 30 giorni. Le ricevute sono state inviate a j.patel@clinic-health.co.uk.",
    },
    {
      type: "contact",
      label: "Contact example",
      text: "La preghiamo di confermare i Suoi dati di contatto: Yuki Takahashi, cellulare +39-333-555-0142, email fatima.al-rashid@example.co.uk.",
    },
  ],
  // Japanese
  ja: [
    {
      type: "appointment",
      label: "Appointment example",
      text: "Alexander Chen 先生とのご予約は 2026年3月15日 火曜日 午後3:30 で確定しております。予約の変更は +81-3-1234-5678 までお電話ください。",
    },
    {
      type: "delivery",
      label: "Delivery example",
      text: "ご注文番号 SXN-7H3-KQ9 は 午前9:00 から 午後5:30 の間に 東京都港区赤坂4丁目2-7 〒107-0052 へお届けいたします。配送追跡番号は UPS-1Z999AA10 です。",
    },
    {
      type: "billing",
      label: "Billing example",
      text: "¥142,500 のご請求書の支払期限は 2026年3月15日 です。30日を過ぎると 2.5% の延滞料が発生します。領収書は j.patel@clinic-health.co.uk へ送信されました。",
    },
    {
      type: "contact",
      label: "Contact example",
      text: "ご連絡先をご確認ください。Yuki Takahashi 様、携帯 +81-90-5555-0142、メール fatima.al-rashid@example.co.uk。",
    },
  ],
  // Kannada
  kn: [
    {
      type: "appointment",
      label: "Appointment example",
      text: "ಡಾ. Alexander Chen ಅವರೊಂದಿಗಿನ ನಿಮ್ಮ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ಮಂಗಳವಾರ, 15 ಮಾರ್ಚ್ 2026 ರಂದು ಸಂಜೆ 3:30 ಕ್ಕೆ ದೃಢಪಡಿಸಲಾಗಿದೆ. ಮರುನಿಗದಿಗಾಗಿ +91-80-1234-5678 ಗೆ ಕರೆ ಮಾಡಿ.",
    },
    {
      type: "delivery",
      label: "Delivery example",
      text: "ನಿಮ್ಮ ಆರ್ಡರ್ SXN-7H3-KQ9 ಎಂ.ಜಿ. ರಸ್ತೆ 42, ಬೆಂಗಳೂರು 560001 ಗೆ ಬೆಳಗ್ಗೆ 9:00 ಮತ್ತು ಸಂಜೆ 5:30 ನಡುವೆ ಬರಲಿದೆ. ಟ್ರ್ಯಾಕಿಂಗ್ UPS-1Z999AA10.",
    },
    {
      type: "billing",
      label: "Billing example",
      text: "ನಿಮ್ಮ ₹1,08,450 ಬಿಲ್ 15 ಮಾರ್ಚ್ 2026 ರಂದು ಬಾಕಿ ಇದೆ, 30 ದಿನಗಳ ನಂತರ 2.5% ವಿಳಂಬ ಶುಲ್ಕ ಅನ್ವಯಿಸುತ್ತದೆ. ರಶೀದಿಗಳನ್ನು j.patel@clinic-health.co.uk ಗೆ ಕಳುಹಿಸಲಾಗಿದೆ.",
    },
    {
      type: "contact",
      label: "Contact example",
      text: "ದಯವಿಟ್ಟು ನಿಮ್ಮ ಸಂಪರ್ಕ ವಿವರಗಳನ್ನು ದೃಢಪಡಿಸಿ: Yuki Takahashi, ಮೊಬೈಲ್ +91-98450-55142, ಇಮೇಲ್ fatima.al-rashid@example.co.uk.",
    },
  ],
  // Kazakh
  kk: [
    {
      type: "appointment",
      label: "Appointment example",
      text: "Доктор Alexander Chen-мен кездесуіңіз 2026 жылдың 15 наурызы, сейсенбі күні сағат 15:30-ға белгіленді. Қайта жоспарлау үшін +7-727-123-4567 нөміріне қоңырау шалыңыз.",
    },
    {
      type: "delivery",
      label: "Delivery example",
      text: "Сіздің SXN-7H3-KQ9 тапсырысыңыз Абай даңғылы 42, 050000 Алматы мекенжайына сағат 09:00 мен 17:30 аралығында жеткізіледі. Бақылау нөмірі UPS-1Z999AA10.",
    },
    {
      type: "billing",
      label: "Billing example",
      text: "485 000 ₸ мөлшеріндегі есепшотыңыз 2026 жылдың 15 наурызында төленуі керек, 30 күннен кейін 2,5% өсімпұл қолданылады. Түбіртектер j.patel@clinic-health.co.uk мекенжайына жіберілді.",
    },
    {
      type: "contact",
      label: "Contact example",
      text: "Байланыс деректеріңізді растаңыз: Yuki Takahashi, ұялы +7-701-555-0142, электрондық пошта fatima.al-rashid@example.co.uk.",
    },
  ],
  // Korean
  ko: [
    {
      type: "appointment",
      label: "Appointment example",
      text: "Alexander Chen 박사님과의 예약이 2026년 3월 15일 화요일 오후 3:30로 확정되었습니다. 일정 변경은 +82-2-1234-5678로 전화해 주세요.",
    },
    {
      type: "delivery",
      label: "Delivery example",
      text: "주문 SXN-7H3-KQ9은(는) 서울특별시 강남구 테헤란로 42, 06234로 오전 9:00 부터 오후 5:30 사이에 배송됩니다. 배송 추적 번호 UPS-1Z999AA10.",
    },
    {
      type: "billing",
      label: "Billing example",
      text: "₩1,450,000의 청구서는 2026년 3월 15일에 만기되며, 30일 후 2.5%의 연체료가 부과됩니다. 영수증은 j.patel@clinic-health.co.uk로 발송되었습니다.",
    },
    {
      type: "contact",
      label: "Contact example",
      text: "연락처를 확인해 주세요: Yuki Takahashi, 휴대폰 +82-10-5555-0142, 이메일 fatima.al-rashid@example.co.uk.",
    },
  ],
  // Latvian
  lv: [
    {
      type: "appointment",
      label: "Appointment example",
      text: "Jūsu vizīte pie dr. Alexander Chen ir apstiprināta otrdien, 2026. gada 15. martā plkst. 15:30. Zvaniet uz +371-6-123-4567, lai pārplānotu.",
    },
    {
      type: "delivery",
      label: "Delivery example",
      text: "Jūsu pasūtījums SXN-7H3-KQ9 tiks piegādāts Brīvības ielā 42, Rīgā, LV-1010 starp plkst. 09:00 un 17:30. Izsekošana UPS-1Z999AA10.",
    },
    {
      type: "billing",
      label: "Billing example",
      text: "Jūsu rēķins 1 299,50 € apmērā ir jāsamaksā 2026. gada 15. martā, pēc 30 dienām tiek piemērota 2,5% kavējuma nauda. Kvītis nosūtītas uz j.patel@clinic-health.co.uk.",
    },
    {
      type: "contact",
      label: "Contact example",
      text: "Lūdzu, apstipriniet savus kontaktdatus: Yuki Takahashi, mobilais +371-2-555-0142, e-pasts fatima.al-rashid@example.co.uk.",
    },
  ],
  // Lithuanian
  lt: [
    {
      type: "appointment",
      label: "Appointment example",
      text: "Jūsų vizitas pas dr. Alexander Chen patvirtintas 2026 m. kovo 15 d., antradienį, 15:30. Norėdami perkelti laiką, skambinkite +370-5-123-4567.",
    },
    {
      type: "delivery",
      label: "Delivery example",
      text: "Jūsų užsakymas SXN-7H3-KQ9 bus pristatytas adresu Gedimino pr. 42, LT-01103 Vilnius, nuo 09:00 iki 17:30. Stebėjimo numeris UPS-1Z999AA10.",
    },
    {
      type: "billing",
      label: "Billing example",
      text: "Jūsų 1 299,50 € sąskaita turi būti apmokėta 2026 m. kovo 15 d., po 30 dienų taikomi 2,5 % delspinigiai. Kvitai išsiųsti adresu j.patel@clinic-health.co.uk.",
    },
    {
      type: "contact",
      label: "Contact example",
      text: "Prašome patvirtinti kontaktinius duomenis: Yuki Takahashi, mobilusis +370-6-555-0142, el. paštas fatima.al-rashid@example.co.uk.",
    },
  ],
  // Macedonian
  mk: [
    {
      type: "appointment",
      label: "Appointment example",
      text: "Вашиот термин кај д-р Alexander Chen е потврден за вторник, 15 март 2026 година, во 15:30. Јавете се на +389-2-123-4567 за да го презакажете.",
    },
    {
      type: "delivery",
      label: "Delivery example",
      text: "Вашата нарачка SXN-7H3-KQ9 ќе пристигне на ул. Македонија 42, 1000 Скопје помеѓу 09:00 и 17:30 часот. Следење UPS-1Z999AA10.",
    },
    {
      type: "billing",
      label: "Billing example",
      text: "Вашата фактура од 75.000 ден. достасува на 15 март 2026 година, со затезна камата од 2,5% по 30 дена. Признаниците се испратени на j.patel@clinic-health.co.uk.",
    },
    {
      type: "contact",
      label: "Contact example",
      text: "Ве молиме потврдете ги контакт податоците: Yuki Takahashi, мобилен +389-70-555-0142, e-пошта fatima.al-rashid@example.co.uk.",
    },
  ],
  // Malay
  ms: [
    {
      type: "appointment",
      label: "Appointment example",
      text: "Temu janji anda dengan Dr. Alexander Chen telah disahkan pada Selasa, 15 Mac 2026, pukul 3:30 petang. Hubungi +60-3-1234-5678 untuk menjadualkan semula.",
    },
    {
      type: "delivery",
      label: "Delivery example",
      text: "Pesanan anda SXN-7H3-KQ9 akan tiba di Jalan Bukit Bintang 42, 55100 Kuala Lumpur antara pukul 9:00 pagi dan 5:30 petang. Penjejakan UPS-1Z999AA10.",
    },
    {
      type: "billing",
      label: "Billing example",
      text: "Invois anda berjumlah RM 5,850.00 akan matang pada 15 Mac 2026, dengan denda lewat 2.5% selepas 30 hari. Resit dihantar ke j.patel@clinic-health.co.uk.",
    },
    {
      type: "contact",
      label: "Contact example",
      text: "Sila sahkan butiran hubungan anda: Yuki Takahashi, telefon bimbit +60-12-555-0142, e-mel fatima.al-rashid@example.co.uk.",
    },
  ],
  // Malayalam
  ml: [
    {
      type: "appointment",
      label: "Appointment example",
      text: "ഡോ. Alexander Chen-യുമായുള്ള നിങ്ങളുടെ അപ്പോയിന്റ്മെന്റ് ചൊവ്വാഴ്ച, 2026 മാർച്ച് 15-ന് വൈകുന്നേരം 3:30-ന് സ്ഥിരീകരിച്ചിരിക്കുന്നു. പുനഃക്രമീകരിക്കാൻ +91-471-123-4567 എന്ന നമ്പറിൽ വിളിക്കുക.",
    },
    {
      type: "delivery",
      label: "Delivery example",
      text: "നിങ്ങളുടെ ഓർഡർ SXN-7H3-KQ9 എം.ജി. റോഡ് 42, തിരുവനന്തപുരം 695001 എന്ന വിലാസത്തിൽ രാവിലെ 9:00 മുതൽ വൈകുന്നേരം 5:30 വരെയുള്ള സമയത്ത് എത്തും. ട്രാക്കിംഗ് UPS-1Z999AA10.",
    },
    {
      type: "billing",
      label: "Billing example",
      text: "നിങ്ങളുടെ ₹1,08,450 ബിൽ 2026 മാർച്ച് 15-ന് അടയ്ക്കേണ്ടതാണ്, 30 ദിവസത്തിന് ശേഷം 2.5% വൈകി ഫീസ് ബാധകമാകും. രസീതുകൾ j.patel@clinic-health.co.uk-ലേക്ക് അയച്ചിട്ടുണ്ട്.",
    },
    {
      type: "contact",
      label: "Contact example",
      text: "ദയവായി നിങ്ങളുടെ കോൺടാക്റ്റ് വിവരങ്ങൾ സ്ഥിരീകരിക്കുക: Yuki Takahashi, മൊബൈൽ +91-94470-55142, ഇമെയിൽ fatima.al-rashid@example.co.uk.",
    },
  ],
  // Marathi
  mr: [
    {
      type: "appointment",
      label: "Appointment example",
      text: "डॉ. Alexander Chen यांच्यासोबत तुमची अपॉइंटमेंट मंगळवार, 15 मार्च 2026 रोजी संध्याकाळी 3:30 वाजता निश्चित झाली आहे. पुनर्नियोजनासाठी +91-20-1234-5678 वर कॉल करा.",
    },
    {
      type: "delivery",
      label: "Delivery example",
      text: "तुमचा ऑर्डर SXN-7H3-KQ9 फर्ग्युसन कॉलेज रोड 42, पुणे 411004 येथे सकाळी 9:00 आणि संध्याकाळी 5:30 दरम्यान पोहोचेल. ट्रॅकिंग UPS-1Z999AA10.",
    },
    {
      type: "billing",
      label: "Billing example",
      text: "तुमचे ₹1,08,450 चे बिल 15 मार्च 2026 रोजी देय आहे, 30 दिवसांनंतर 2.5% विलंब शुल्क लागू होईल. पावत्या j.patel@clinic-health.co.uk वर पाठवल्या आहेत.",
    },
    {
      type: "contact",
      label: "Contact example",
      text: "कृपया तुमचे संपर्क तपशील निश्चित करा: Yuki Takahashi, मोबाईल +91-98220-55142, ईमेल fatima.al-rashid@example.co.uk.",
    },
  ],
  // Norwegian
  no: [
    {
      type: "appointment",
      label: "Appointment example",
      text: "Timen din hos dr. Alexander Chen er bekreftet til tirsdag 15. mars 2026 kl. 15:30. Ring +47-21-23-45-67 for å endre tidspunktet.",
    },
    {
      type: "delivery",
      label: "Delivery example",
      text: "Din bestilling SXN-7H3-KQ9 leveres på Karl Johans gate 42, 0162 Oslo mellom kl. 09:00 og 17:30. Sporing UPS-1Z999AA10.",
    },
    {
      type: "billing",
      label: "Billing example",
      text: "Din faktura på 13 450,00 kr forfaller 15. mars 2026, med en forsinkelsesrente på 2,5% etter 30 dager. Kvitteringer er sendt til j.patel@clinic-health.co.uk.",
    },
    {
      type: "contact",
      label: "Contact example",
      text: "Vennligst bekreft kontaktopplysningene dine: Yuki Takahashi, mobil +47-91-55-01-42, e-post fatima.al-rashid@example.co.uk.",
    },
  ],
  // Persian
  fa: [
    {
      type: "appointment",
      label: "Appointment example",
      text: "نوبت شما با دکتر Alexander Chen برای سه‌شنبه، 15 مارس 2026 ساعت 3:30 بعد از ظهر تأیید شده است. برای تغییر زمان با شماره +98-21-1234-5678 تماس بگیرید.",
    },
    {
      type: "delivery",
      label: "Delivery example",
      text: "سفارش شما SXN-7H3-KQ9 به آدرس خیابان ولیعصر، پلاک 42، تهران 1415 بین ساعت 9:00 صبح و 5:30 بعد از ظهر تحویل داده می‌شود. شماره پیگیری UPS-1Z999AA10.",
    },
    {
      type: "billing",
      label: "Billing example",
      text: "فاکتور شما به مبلغ 540,000,000 ریال در 15 مارس 2026 سررسید می‌شود، پس از 30 روز 2.5% جریمه تأخیر اعمال می‌شود. رسیدها به j.patel@clinic-health.co.uk ارسال شد.",
    },
    {
      type: "contact",
      label: "Contact example",
      text: "لطفاً اطلاعات تماس خود را تأیید کنید: Yuki Takahashi، موبایل +98-912-555-0142، ایمیل fatima.al-rashid@example.co.uk.",
    },
  ],
  // Polish
  pl: [
    {
      type: "appointment",
      label: "Appointment example",
      text: "Twoja wizyta u dr Alexander Chen jest potwierdzona na wtorek, 15 marca 2026 r., o godz. 15:30. Zadzwoń pod +48-22-123-45-67, aby zmienić termin.",
    },
    {
      type: "delivery",
      label: "Delivery example",
      text: "Twoje zamówienie SXN-7H3-KQ9 zostanie dostarczone na ul. Marszałkowską 42, 00-061 Warszawa między godz. 09:00 a 17:30. Śledzenie UPS-1Z999AA10.",
    },
    {
      type: "billing",
      label: "Billing example",
      text: "Twoja faktura na kwotę 5.450,50 zł jest płatna do 15 marca 2026 r., odsetki za zwłokę 2,5% naliczane są po 30 dniach. Paragony zostały wysłane na j.patel@clinic-health.co.uk.",
    },
    {
      type: "contact",
      label: "Contact example",
      text: "Prosimy o potwierdzenie danych kontaktowych: Yuki Takahashi, tel. komórkowy +48-601-555-142, e-mail fatima.al-rashid@example.co.uk.",
    },
  ],
  // Portuguese
  pt: [
    {
      type: "appointment",
      label: "Appointment example",
      text: "Sua consulta com o Dr. Alexander Chen está confirmada para terça-feira, 15 de março de 2026, às 15:30. Ligue para +55-11-1234-5678 para reagendar.",
    },
    {
      type: "delivery",
      label: "Delivery example",
      text: "Seu pedido SXN-7H3-KQ9 chegará à Av. Paulista 42, São Paulo, SP 01310-100 entre 09:00 e 17:30. Rastreamento UPS-1Z999AA10.",
    },
    {
      type: "billing",
      label: "Billing example",
      text: "Sua fatura no valor de R$ 6.850,00 vence em 15 de março de 2026, com uma taxa de atraso de 2,5% após 30 dias. Recibos enviados para j.patel@clinic-health.co.uk.",
    },
    {
      type: "contact",
      label: "Contact example",
      text: "Por favor confirme seus dados de contato: Yuki Takahashi, celular +55-11-95555-0142, e-mail fatima.al-rashid@example.co.uk.",
    },
  ],
  // Punjabi
  pa: [
    {
      type: "appointment",
      label: "Appointment example",
      text: "ਡਾ. Alexander Chen ਨਾਲ ਤੁਹਾਡੀ ਅਪੌਇੰਟਮੈਂਟ ਮੰਗਲਵਾਰ, 15 ਮਾਰਚ 2026 ਨੂੰ ਸ਼ਾਮ 3:30 ਵਜੇ ਦੀ ਪੁਸ਼ਟੀ ਕੀਤੀ ਗਈ ਹੈ। ਮੁੜ-ਨਿਯਤ ਕਰਨ ਲਈ +91-172-123-4567 'ਤੇ ਕਾਲ ਕਰੋ।",
    },
    {
      type: "delivery",
      label: "Delivery example",
      text: "ਤੁਹਾਡਾ ਆਰਡਰ SXN-7H3-KQ9 ਸੈਕਟਰ 17, ਦੁਕਾਨ 42, ਚੰਡੀਗੜ੍ਹ 160017 ਉੱਤੇ ਸਵੇਰੇ 9:00 ਅਤੇ ਸ਼ਾਮ 5:30 ਵਿਚਕਾਰ ਪਹੁੰਚੇਗਾ। ਟ੍ਰੈਕਿੰਗ UPS-1Z999AA10।",
    },
    {
      type: "billing",
      label: "Billing example",
      text: "ਤੁਹਾਡਾ ₹1,08,450 ਦਾ ਬਿੱਲ 15 ਮਾਰਚ 2026 ਨੂੰ ਭੁਗਤਾਨਯੋਗ ਹੈ, 30 ਦਿਨਾਂ ਬਾਅਦ 2.5% ਦੇਰੀ ਫੀਸ ਲਾਗੂ ਹੋਵੇਗੀ। ਰਸੀਦਾਂ j.patel@clinic-health.co.uk ਉੱਤੇ ਭੇਜੀਆਂ ਗਈਆਂ ਹਨ।",
    },
    {
      type: "contact",
      label: "Contact example",
      text: "ਕਿਰਪਾ ਕਰਕੇ ਆਪਣੇ ਸੰਪਰਕ ਵੇਰਵਿਆਂ ਦੀ ਪੁਸ਼ਟੀ ਕਰੋ: Yuki Takahashi, ਮੋਬਾਈਲ +91-98140-55142, ਈਮੇਲ fatima.al-rashid@example.co.uk।",
    },
  ],
  // Romanian
  ro: [
    {
      type: "appointment",
      label: "Appointment example",
      text: "Programarea dvs. la dr. Alexander Chen este confirmată pentru marți, 15 martie 2026, la ora 15:30. Sunați la +40-21-123-4567 pentru a o reprograma.",
    },
    {
      type: "delivery",
      label: "Delivery example",
      text: "Comanda dvs. SXN-7H3-KQ9 va fi livrată pe Bd. Magheru nr. 42, 010336 București între orele 09:00 și 17:30. Urmărire UPS-1Z999AA10.",
    },
    {
      type: "billing",
      label: "Billing example",
      text: "Factura dvs. de 6.450,50 lei este scadentă la 15 martie 2026, cu o penalitate de 2,5% după 30 de zile. Chitanțele au fost trimise la j.patel@clinic-health.co.uk.",
    },
    {
      type: "contact",
      label: "Contact example",
      text: "Vă rugăm să confirmați datele de contact: Yuki Takahashi, mobil +40-721-555-142, e-mail fatima.al-rashid@example.co.uk.",
    },
  ],
  // Russian
  ru: [
    {
      type: "appointment",
      label: "Appointment example",
      text: "Ваш приём у доктора Alexander Chen подтверждён на вторник, 15 марта 2026 года, в 15:30. Позвоните по номеру +7-495-123-45-67, чтобы перенести.",
    },
    {
      type: "delivery",
      label: "Delivery example",
      text: "Ваш заказ SXN-7H3-KQ9 будет доставлен по адресу ул. Тверская, д. 42, 125009 Москва с 09:00 до 17:30. Номер отслеживания UPS-1Z999AA10.",
    },
    {
      type: "billing",
      label: "Billing example",
      text: "Ваш счёт на сумму 125 750,50 ₽ подлежит оплате 15 марта 2026 года, после 30 дней начисляется пеня 2,5%. Квитанции отправлены на j.patel@clinic-health.co.uk.",
    },
    {
      type: "contact",
      label: "Contact example",
      text: "Пожалуйста, подтвердите контактные данные: Yuki Takahashi, мобильный +7-916-555-01-42, электронная почта fatima.al-rashid@example.co.uk.",
    },
  ],
  // Serbian
  sr: [
    {
      type: "appointment",
      label: "Appointment example",
      text: "Ваш преглед код др Alexander Chen потврђен је за уторак, 15. марта 2026. у 15:30. Позовите +381-11-123-4567 за промену термина.",
    },
    {
      type: "delivery",
      label: "Delivery example",
      text: "Ваша наруџбина SXN-7H3-KQ9 стићи ће на адресу Кнез Михаилова 42, 11000 Београд између 09:00 и 17:30. Праћење UPS-1Z999AA10.",
    },
    {
      type: "billing",
      label: "Billing example",
      text: "Ваш рачун у износу од 145.000 дин. доспева 15. марта 2026, уз затезну камату од 2,5% након 30 дана. Потврде су послате на j.patel@clinic-health.co.uk.",
    },
    {
      type: "contact",
      label: "Contact example",
      text: "Молимо потврдите контакт податке: Yuki Takahashi, мобилни +381-64-555-0142, имејл fatima.al-rashid@example.co.uk.",
    },
  ],
  // Slovak
  sk: [
    {
      type: "appointment",
      label: "Appointment example",
      text: "Vaša návšteva u dr. Alexander Chen je potvrdená na utorok 15. marca 2026 o 15:30. Pre zmenu termínu volajte na +421-2-123-456-78.",
    },
    {
      type: "delivery",
      label: "Delivery example",
      text: "Vaša objednávka SXN-7H3-KQ9 bude doručená na adresu Hlavná 42, 811 01 Bratislava medzi 09:00 a 17:30. Sledovanie UPS-1Z999AA10.",
    },
    {
      type: "billing",
      label: "Billing example",
      text: "Vaša faktúra vo výške 1 299,50 € je splatná 15. marca 2026, s úrokom z omeškania 2,5 % po 30 dňoch. Potvrdenky boli odoslané na j.patel@clinic-health.co.uk.",
    },
    {
      type: "contact",
      label: "Contact example",
      text: "Prosím potvrďte svoje kontaktné údaje: Yuki Takahashi, mobil +421-903-555-142, e-mail fatima.al-rashid@example.co.uk.",
    },
  ],
  // Slovenian
  sl: [
    {
      type: "appointment",
      label: "Appointment example",
      text: "Vaš pregled pri dr. Alexander Chen je potrjen za torek, 15. marca 2026, ob 15.30. Pokličite +386-1-400-1234 za prestavitev termina.",
    },
    {
      type: "delivery",
      label: "Delivery example",
      text: "Vaše naročilo SXN-7H3-KQ9 bo dostavljeno na Slovenska cesta 42, 1000 Ljubljana med 9.00 in 17.30. Sledenje UPS-1Z999AA10.",
    },
    {
      type: "billing",
      label: "Billing example",
      text: "Račun v znesku 1.299,50 € zapade 15. marca 2026, po 30 dneh veljajo 2,5 % zamudne obresti. Potrdila so bila poslana na j.patel@clinic-health.co.uk.",
    },
    {
      type: "contact",
      label: "Contact example",
      text: "Prosimo, potrdite svoje kontaktne podatke: Yuki Takahashi, mobilni +386-40-555-142, e-pošta fatima.al-rashid@example.co.uk.",
    },
  ],
  // Spanish
  es: [
    {
      type: "appointment",
      label: "Appointment example",
      text: "Su cita con el Dr. Alexander Chen está confirmada para el martes 15 de marzo de 2026 a las 15:30. Llame al +34-91-123-4567 para reprogramarla.",
    },
    {
      type: "delivery",
      label: "Delivery example",
      text: "Su pedido SXN-7H3-KQ9 llegará a Calle Gran Vía 42, 28013 Madrid entre las 09:00 y las 17:30. Seguimiento UPS-1Z999AA10.",
    },
    {
      type: "billing",
      label: "Billing example",
      text: "Su factura de 1.299,50 € vence el 15 de marzo de 2026, con un recargo del 2,5% después de 30 días. Los recibos se han enviado a j.patel@clinic-health.co.uk.",
    },
    {
      type: "contact",
      label: "Contact example",
      text: "Por favor, confirme sus datos de contacto: Yuki Takahashi, móvil +34-688-555-142, correo fatima.al-rashid@example.co.uk.",
    },
  ],
  // Swahili
  sw: [
    {
      type: "appointment",
      label: "Appointment example",
      text: "Miadi yako na Dk. Alexander Chen imethibitishwa Jumanne, tarehe 15 Machi 2026 saa 3:30 alasiri. Piga simu +255-22-123-4567 ili kuratibu upya.",
    },
    {
      type: "delivery",
      label: "Delivery example",
      text: "Agizo lako SXN-7H3-KQ9 litafika Mtaa wa Samora 42, Dar es Salaam 11101 kati ya saa 9:00 asubuhi na 5:30 jioni. Kufuatilia UPS-1Z999AA10.",
    },
    {
      type: "billing",
      label: "Billing example",
      text: "Ankara yako ya TSh 2,850,000 inatakiwa kulipwa tarehe 15 Machi 2026, faini ya kuchelewa ya 2.5% inatumika baada ya siku 30. Risiti zimetumwa kwa j.patel@clinic-health.co.uk.",
    },
    {
      type: "contact",
      label: "Contact example",
      text: "Tafadhali thibitisha maelezo yako ya mawasiliano: Yuki Takahashi, simu ya mkononi +255-75-555-0142, barua pepe fatima.al-rashid@example.co.uk.",
    },
  ],
  // Swedish
  sv: [
    {
      type: "appointment",
      label: "Appointment example",
      text: "Din tid hos dr. Alexander Chen är bekräftad till tisdag den 15 mars 2026 kl. 15:30. Ring +46-8-123-4567 för att boka om.",
    },
    {
      type: "delivery",
      label: "Delivery example",
      text: "Din beställning SXN-7H3-KQ9 levereras till Drottninggatan 42, 111 21 Stockholm mellan kl. 09:00 och 17:30. Spårning UPS-1Z999AA10.",
    },
    {
      type: "billing",
      label: "Billing example",
      text: "Din faktura på 13 450,00 kr förfaller den 15 mars 2026, med en dröjsmålsränta på 2,5% efter 30 dagar. Kvitton har skickats till j.patel@clinic-health.co.uk.",
    },
    {
      type: "contact",
      label: "Contact example",
      text: "Vänligen bekräfta dina kontaktuppgifter: Yuki Takahashi, mobil +46-70-555-01-42, e-post fatima.al-rashid@example.co.uk.",
    },
  ],
  // Tagalog
  tl: [
    {
      type: "appointment",
      label: "Appointment example",
      text: "Nakumpirma ang iyong appointment kay Dr. Alexander Chen sa Martes, Marso 15, 2026 nang 3:30 ng hapon. Tumawag sa +63-2-1234-5678 para sa pagbabago ng iskedyul.",
    },
    {
      type: "delivery",
      label: "Delivery example",
      text: "Ang iyong order na SXN-7H3-KQ9 ay darating sa Ayala Avenue 42, Makati City 1226 sa pagitan ng 9:00 ng umaga at 5:30 ng hapon. Tracking UPS-1Z999AA10.",
    },
    {
      type: "billing",
      label: "Billing example",
      text: "Ang iyong invoice na ₱72,500.00 ay dapat bayaran sa Marso 15, 2026, na may 2.5% na multa pagkatapos ng 30 araw. Ipinadala ang mga resibo sa j.patel@clinic-health.co.uk.",
    },
    {
      type: "contact",
      label: "Contact example",
      text: "Pakikumpirma ang iyong mga detalye ng kontak: Yuki Takahashi, mobile +63-917-555-0142, email fatima.al-rashid@example.co.uk.",
    },
  ],
  // Tamil
  ta: [
    {
      type: "appointment",
      label: "Appointment example",
      text: "டாக்டர் Alexander Chen உடனான உங்கள் சந்திப்பு செவ்வாய்க்கிழமை, 15 மார்ச் 2026 அன்று மாலை 3:30 மணிக்கு உறுதி செய்யப்பட்டுள்ளது. மீண்டும் திட்டமிட +91-44-1234-5678 என்ற எண்ணுக்கு அழைக்கவும்.",
    },
    {
      type: "delivery",
      label: "Delivery example",
      text: "உங்கள் ஆர்டர் SXN-7H3-KQ9 அண்ணா சாலை 42, சென்னை 600002 என்ற முகவரிக்கு காலை 9:00 முதல் மாலை 5:30 மணிக்குள் வந்து சேரும். கண்காணிப்பு UPS-1Z999AA10.",
    },
    {
      type: "billing",
      label: "Billing example",
      text: "உங்கள் ₹1,08,450 ரசீது 15 மார்ச் 2026 அன்று செலுத்தப்பட வேண்டும், 30 நாட்களுக்குப் பிறகு 2.5% தாமத கட்டணம் பொருந்தும். ரசீதுகள் j.patel@clinic-health.co.uk க்கு அனுப்பப்பட்டுள்ளன.",
    },
    {
      type: "contact",
      label: "Contact example",
      text: "உங்கள் தொடர்பு விவரங்களை உறுதிப்படுத்தவும்: Yuki Takahashi, மொபைல் +91-98410-55142, மின்னஞ்சல் fatima.al-rashid@example.co.uk.",
    },
  ],
  // Telugu
  te: [
    {
      type: "appointment",
      label: "Appointment example",
      text: "డా. Alexander Chen తో మీ అపాయింట్‌మెంట్ మంగళవారం, 15 మార్చి 2026 సాయంత్రం 3:30 గంటలకు ధృవీకరించబడింది. పునఃనిర్ణయించడానికి +91-40-1234-5678 కు కాల్ చేయండి.",
    },
    {
      type: "delivery",
      label: "Delivery example",
      text: "మీ ఆర్డర్ SXN-7H3-KQ9 బంజారా హిల్స్ రోడ్ 42, హైదరాబాద్ 500034 కు ఉదయం 9:00 మరియు సాయంత్రం 5:30 మధ్య చేరుతుంది. ట్రాకింగ్ UPS-1Z999AA10.",
    },
    {
      type: "billing",
      label: "Billing example",
      text: "మీ ₹1,08,450 బిల్లు 15 మార్చి 2026 న చెల్లించవలసి ఉంది, 30 రోజుల తర్వాత 2.5% ఆలస్య రుసుము వర్తిస్తుంది. రసీదులు j.patel@clinic-health.co.uk కు పంపబడ్డాయి.",
    },
    {
      type: "contact",
      label: "Contact example",
      text: "దయచేసి మీ సంప్రదింపు వివరాలను ధృవీకరించండి: Yuki Takahashi, మొబైల్ +91-98480-55142, ఇమెయిల్ fatima.al-rashid@example.co.uk.",
    },
  ],
  // Thai
  th: [
    {
      type: "appointment",
      label: "Appointment example",
      text: "การนัดหมายของคุณกับ ดร. Alexander Chen ได้รับการยืนยันในวันอังคารที่ 15 มีนาคม 2026 เวลา 15:30 น. โทรหาเราที่ +66-2-123-4567 เพื่อเปลี่ยนเวลานัด",
    },
    {
      type: "delivery",
      label: "Delivery example",
      text: "คำสั่งซื้อของคุณ SXN-7H3-KQ9 จะจัดส่งที่ถนนสุขุมวิท 42 แขวงคลองเตย กรุงเทพฯ 10110 ระหว่างเวลา 9:00 น. ถึง 17:30 น. หมายเลขติดตาม UPS-1Z999AA10",
    },
    {
      type: "billing",
      label: "Billing example",
      text: "ใบแจ้งหนี้ของคุณจำนวน ฿45,250 ครบกำหนดชำระวันที่ 15 มีนาคม 2026 โดยมีค่าปรับล่าช้า 2.5% หลังจาก 30 วัน ใบเสร็จส่งไปยัง j.patel@clinic-health.co.uk",
    },
    {
      type: "contact",
      label: "Contact example",
      text: "กรุณายืนยันข้อมูลติดต่อ: Yuki Takahashi มือถือ +66-81-555-0142 อีเมล fatima.al-rashid@example.co.uk",
    },
  ],
  // Turkish
  tr: [
    {
      type: "appointment",
      label: "Appointment example",
      text: "Dr. Alexander Chen ile randevunuz 15 Mart 2026 Salı günü saat 15:30 için onaylanmıştır. Randevuyu değiştirmek için +90-212-123-4567 numaralı telefonu arayın.",
    },
    {
      type: "delivery",
      label: "Delivery example",
      text: "SXN-7H3-KQ9 siparişiniz İstiklal Cad. No: 42, 34433 Beyoğlu/İstanbul adresine saat 09:00 ile 17:30 arasında teslim edilecektir. Takip UPS-1Z999AA10.",
    },
    {
      type: "billing",
      label: "Billing example",
      text: "42.500,00 ₺ tutarındaki faturanızın son ödeme tarihi 15 Mart 2026'dır ve 30 gün sonra %2,5 gecikme faizi uygulanır. Makbuzlar j.patel@clinic-health.co.uk adresine gönderildi.",
    },
    {
      type: "contact",
      label: "Contact example",
      text: "Lütfen iletişim bilgilerinizi onaylayın: Yuki Takahashi, cep telefonu +90-532-555-0142, e-posta fatima.al-rashid@example.co.uk.",
    },
  ],
  // Ukrainian
  uk: [
    {
      type: "appointment",
      label: "Appointment example",
      text: "Ваш прийом у доктора Alexander Chen підтверджено на вівторок, 15 березня 2026 року, о 15:30. Зателефонуйте за номером +380-44-123-4567, щоб перенести візит.",
    },
    {
      type: "delivery",
      label: "Delivery example",
      text: "Ваше замовлення SXN-7H3-KQ9 буде доставлено на вул. Хрещатик, 42, 01001 Київ з 09:00 до 17:30. Номер відстеження UPS-1Z999AA10.",
    },
    {
      type: "billing",
      label: "Billing example",
      text: "Ваш рахунок на суму 52 450,00 ₴ підлягає оплаті 15 березня 2026 року, через 30 днів нараховується пеня 2,5%. Квитанції надіслано на j.patel@clinic-health.co.uk.",
    },
    {
      type: "contact",
      label: "Contact example",
      text: "Будь ласка, підтвердіть контактні дані: Yuki Takahashi, мобільний +380-67-555-0142, електронна пошта fatima.al-rashid@example.co.uk.",
    },
  ],
  // Urdu
  ur: [
    {
      type: "appointment",
      label: "Appointment example",
      text: "ڈاکٹر Alexander Chen کے ساتھ آپ کا اپائنٹمنٹ منگل، 15 مارچ 2026 شام 3:30 بجے کے لیے کنفرم ہے۔ دوبارہ وقت مقرر کرنے کے لیے +92-21-1234-5678 پر کال کریں۔",
    },
    {
      type: "delivery",
      label: "Delivery example",
      text: "آپ کا آرڈر SXN-7H3-KQ9 ایم اے جناح روڈ 42، کراچی 74400 پر صبح 9:00 بجے اور شام 5:30 بجے کے درمیان پہنچے گا۔ ٹریکنگ UPS-1Z999AA10۔",
    },
    {
      type: "billing",
      label: "Billing example",
      text: "آپ کا Rs 385,000 کا بل 15 مارچ 2026 کو واجب الادا ہے، 30 دن کے بعد 2.5% تاخیر فیس لاگو ہوگی۔ رسیدیں j.patel@clinic-health.co.uk پر بھیج دی گئی ہیں۔",
    },
    {
      type: "contact",
      label: "Contact example",
      text: "براہ کرم اپنی رابطہ کی تفصیلات کی تصدیق کریں: Yuki Takahashi، موبائل +92-300-555-0142، ای میل fatima.al-rashid@example.co.uk۔",
    },
  ],
  // Vietnamese
  vi: [
    {
      type: "appointment",
      label: "Appointment example",
      text: "Cuộc hẹn của bạn với Tiến sĩ Alexander Chen đã được xác nhận vào thứ Ba, ngày 15 tháng 3 năm 2026 lúc 15:30. Gọi +84-28-1234-5678 để đổi lịch.",
    },
    {
      type: "delivery",
      label: "Delivery example",
      text: "Đơn hàng SXN-7H3-KQ9 của bạn sẽ được giao đến 42 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh 700000 từ 09:00 đến 17:30. Mã theo dõi UPS-1Z999AA10.",
    },
    {
      type: "billing",
      label: "Billing example",
      text: "Hóa đơn của bạn trị giá 32.450.000 ₫ đến hạn thanh toán vào ngày 15 tháng 3 năm 2026, phí trễ hạn 2,5% được áp dụng sau 30 ngày. Biên lai đã gửi đến j.patel@clinic-health.co.uk.",
    },
    {
      type: "contact",
      label: "Contact example",
      text: "Vui lòng xác nhận thông tin liên hệ: Yuki Takahashi, di động +84-90-555-0142, email fatima.al-rashid@example.co.uk.",
    },
  ],
  // Welsh
  cy: [
    {
      type: "appointment",
      label: "Appointment example",
      text: "Mae eich apwyntiad gyda Dr. Alexander Chen wedi ei gadarnhau ar gyfer dydd Mawrth, 15 Mawrth 2026 am 15:30. Ffoniwch +44-29-1234-5678 i aildrefnu.",
    },
    {
      type: "delivery",
      label: "Delivery example",
      text: "Bydd eich archeb SXN-7H3-KQ9 yn cyrraedd 42 Heol y Frenhines, Caerdydd CF10 2BH rhwng 09:00 a 17:30. Olrhain UPS-1Z999AA10.",
    },
    {
      type: "billing",
      label: "Billing example",
      text: "Mae eich anfoneb o £1,299.50 yn ddyledus ar 15 Mawrth 2026, gyda ffi hwyr o 2.5% ar ôl 30 diwrnod. Anfonwyd y derbynebau at j.patel@clinic-health.co.uk.",
    },
    {
      type: "contact",
      label: "Contact example",
      text: "A wnewch chi gadarnhau eich manylion cyswllt: Yuki Takahashi, ffôn symudol +44-77-5555-0142, e-bost fatima.al-rashid@example.co.uk.",
    },
  ],
};

export function getSamplesForLanguage(language: string): CompareTtsSample[] {
  return TTS_SAMPLES[language] || TTS_SAMPLES["en"];
}

export function getFirstSampleText(language: string): string {
  const samples = getSamplesForLanguage(language);
  return samples[0]?.text || "";
}
