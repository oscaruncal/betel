/**
 * Lista de países para el form de Betel.
 * Los países con priority: 1 aparecen primero (separador visual abajo) y
 * el resto va alfabético. Nombres en ES y EN.
 *
 * Expone: window.COUNTRIES, window.populateCountrySelect(selectEl, lang)
 */
(function (w) {
  'use strict';

  var COUNTRIES = [
    // Frecuentes (priority: 1) — orden manual: AR primero (audiencia mayoritaria)
    { code: 'AR', es: 'Argentina',          en: 'Argentina',           priority: 1 },
    { code: 'UY', es: 'Uruguay',            en: 'Uruguay',             priority: 1 },
    { code: 'PY', es: 'Paraguay',           en: 'Paraguay',            priority: 1 },
    { code: 'CL', es: 'Chile',              en: 'Chile',               priority: 1 },
    { code: 'BO', es: 'Bolivia',            en: 'Bolivia',             priority: 1 },
    { code: 'PE', es: 'Perú',               en: 'Peru',                priority: 1 },
    { code: 'CO', es: 'Colombia',           en: 'Colombia',            priority: 1 },
    { code: 'MX', es: 'México',             en: 'Mexico',              priority: 1 },
    { code: 'ES', es: 'España',             en: 'Spain',               priority: 1 },
    { code: 'US', es: 'Estados Unidos',     en: 'United States',       priority: 1 },

    // Resto alfabético en español
    { code: 'AF', es: 'Afganistán',                       en: 'Afghanistan' },
    { code: 'AL', es: 'Albania',                          en: 'Albania' },
    { code: 'DE', es: 'Alemania',                         en: 'Germany' },
    { code: 'AD', es: 'Andorra',                          en: 'Andorra' },
    { code: 'AO', es: 'Angola',                           en: 'Angola' },
    { code: 'AI', es: 'Anguila',                          en: 'Anguilla' },
    { code: 'AQ', es: 'Antártida',                        en: 'Antarctica' },
    { code: 'AG', es: 'Antigua y Barbuda',                en: 'Antigua and Barbuda' },
    { code: 'SA', es: 'Arabia Saudita',                   en: 'Saudi Arabia' },
    { code: 'DZ', es: 'Argelia',                          en: 'Algeria' },
    { code: 'AM', es: 'Armenia',                          en: 'Armenia' },
    { code: 'AW', es: 'Aruba',                            en: 'Aruba' },
    { code: 'AU', es: 'Australia',                        en: 'Australia' },
    { code: 'AT', es: 'Austria',                          en: 'Austria' },
    { code: 'AZ', es: 'Azerbaiyán',                       en: 'Azerbaijan' },
    { code: 'BS', es: 'Bahamas',                          en: 'Bahamas' },
    { code: 'BH', es: 'Baréin',                           en: 'Bahrain' },
    { code: 'BD', es: 'Bangladés',                        en: 'Bangladesh' },
    { code: 'BB', es: 'Barbados',                         en: 'Barbados' },
    { code: 'BE', es: 'Bélgica',                          en: 'Belgium' },
    { code: 'BZ', es: 'Belice',                           en: 'Belize' },
    { code: 'BJ', es: 'Benín',                            en: 'Benin' },
    { code: 'BM', es: 'Bermudas',                         en: 'Bermuda' },
    { code: 'BY', es: 'Bielorrusia',                      en: 'Belarus' },
    { code: 'MM', es: 'Birmania (Myanmar)',               en: 'Myanmar' },
    { code: 'BA', es: 'Bosnia y Herzegovina',             en: 'Bosnia and Herzegovina' },
    { code: 'BW', es: 'Botsuana',                         en: 'Botswana' },
    { code: 'BR', es: 'Brasil',                           en: 'Brazil' },
    { code: 'BN', es: 'Brunéi',                           en: 'Brunei' },
    { code: 'BG', es: 'Bulgaria',                         en: 'Bulgaria' },
    { code: 'BF', es: 'Burkina Faso',                     en: 'Burkina Faso' },
    { code: 'BI', es: 'Burundi',                          en: 'Burundi' },
    { code: 'BT', es: 'Bután',                            en: 'Bhutan' },
    { code: 'CV', es: 'Cabo Verde',                       en: 'Cape Verde' },
    { code: 'KH', es: 'Camboya',                          en: 'Cambodia' },
    { code: 'CM', es: 'Camerún',                          en: 'Cameroon' },
    { code: 'CA', es: 'Canadá',                           en: 'Canada' },
    { code: 'QA', es: 'Catar',                            en: 'Qatar' },
    { code: 'TD', es: 'Chad',                             en: 'Chad' },
    { code: 'CN', es: 'China',                            en: 'China' },
    { code: 'CY', es: 'Chipre',                           en: 'Cyprus' },
    { code: 'VA', es: 'Ciudad del Vaticano',              en: 'Vatican City' },
    { code: 'KM', es: 'Comoras',                          en: 'Comoros' },
    { code: 'CG', es: 'Congo',                            en: 'Congo' },
    { code: 'CD', es: 'Congo (RD)',                       en: 'Congo (DRC)' },
    { code: 'KP', es: 'Corea del Norte',                  en: 'North Korea' },
    { code: 'KR', es: 'Corea del Sur',                    en: 'South Korea' },
    { code: 'CI', es: 'Costa de Marfil',                  en: "Côte d'Ivoire" },
    { code: 'CR', es: 'Costa Rica',                       en: 'Costa Rica' },
    { code: 'HR', es: 'Croacia',                          en: 'Croatia' },
    { code: 'CU', es: 'Cuba',                             en: 'Cuba' },
    { code: 'CW', es: 'Curazao',                          en: 'Curaçao' },
    { code: 'DK', es: 'Dinamarca',                        en: 'Denmark' },
    { code: 'DM', es: 'Dominica',                         en: 'Dominica' },
    { code: 'EC', es: 'Ecuador',                          en: 'Ecuador' },
    { code: 'EG', es: 'Egipto',                           en: 'Egypt' },
    { code: 'SV', es: 'El Salvador',                      en: 'El Salvador' },
    { code: 'AE', es: 'Emiratos Árabes Unidos',           en: 'United Arab Emirates' },
    { code: 'ER', es: 'Eritrea',                          en: 'Eritrea' },
    { code: 'SK', es: 'Eslovaquia',                       en: 'Slovakia' },
    { code: 'SI', es: 'Eslovenia',                        en: 'Slovenia' },
    { code: 'EE', es: 'Estonia',                          en: 'Estonia' },
    { code: 'ET', es: 'Etiopía',                          en: 'Ethiopia' },
    { code: 'PH', es: 'Filipinas',                        en: 'Philippines' },
    { code: 'FI', es: 'Finlandia',                        en: 'Finland' },
    { code: 'FJ', es: 'Fiyi',                             en: 'Fiji' },
    { code: 'FR', es: 'Francia',                          en: 'France' },
    { code: 'GA', es: 'Gabón',                            en: 'Gabon' },
    { code: 'GM', es: 'Gambia',                           en: 'Gambia' },
    { code: 'GE', es: 'Georgia',                          en: 'Georgia' },
    { code: 'GH', es: 'Ghana',                            en: 'Ghana' },
    { code: 'GI', es: 'Gibraltar',                        en: 'Gibraltar' },
    { code: 'GD', es: 'Granada',                          en: 'Grenada' },
    { code: 'GR', es: 'Grecia',                           en: 'Greece' },
    { code: 'GL', es: 'Groenlandia',                      en: 'Greenland' },
    { code: 'GP', es: 'Guadalupe',                        en: 'Guadeloupe' },
    { code: 'GU', es: 'Guam',                             en: 'Guam' },
    { code: 'GT', es: 'Guatemala',                        en: 'Guatemala' },
    { code: 'GF', es: 'Guayana Francesa',                 en: 'French Guiana' },
    { code: 'GG', es: 'Guernsey',                         en: 'Guernsey' },
    { code: 'GN', es: 'Guinea',                           en: 'Guinea' },
    { code: 'GQ', es: 'Guinea Ecuatorial',                en: 'Equatorial Guinea' },
    { code: 'GW', es: 'Guinea-Bisáu',                     en: 'Guinea-Bissau' },
    { code: 'GY', es: 'Guyana',                           en: 'Guyana' },
    { code: 'HT', es: 'Haití',                            en: 'Haiti' },
    { code: 'HN', es: 'Honduras',                         en: 'Honduras' },
    { code: 'HK', es: 'Hong Kong',                        en: 'Hong Kong' },
    { code: 'HU', es: 'Hungría',                          en: 'Hungary' },
    { code: 'IN', es: 'India',                            en: 'India' },
    { code: 'ID', es: 'Indonesia',                        en: 'Indonesia' },
    { code: 'IQ', es: 'Irak',                             en: 'Iraq' },
    { code: 'IR', es: 'Irán',                             en: 'Iran' },
    { code: 'IE', es: 'Irlanda',                          en: 'Ireland' },
    { code: 'IS', es: 'Islandia',                         en: 'Iceland' },
    { code: 'KY', es: 'Islas Caimán',                     en: 'Cayman Islands' },
    { code: 'CK', es: 'Islas Cook',                       en: 'Cook Islands' },
    { code: 'FO', es: 'Islas Feroe',                      en: 'Faroe Islands' },
    { code: 'FK', es: 'Islas Malvinas',                   en: 'Falkland Islands' },
    { code: 'MP', es: 'Islas Marianas del Norte',         en: 'Northern Mariana Islands' },
    { code: 'MH', es: 'Islas Marshall',                   en: 'Marshall Islands' },
    { code: 'SB', es: 'Islas Salomón',                    en: 'Solomon Islands' },
    { code: 'TC', es: 'Islas Turcas y Caicos',            en: 'Turks and Caicos Islands' },
    { code: 'VG', es: 'Islas Vírgenes Británicas',        en: 'British Virgin Islands' },
    { code: 'VI', es: 'Islas Vírgenes de los EE. UU.',    en: 'U.S. Virgin Islands' },
    { code: 'IL', es: 'Israel',                           en: 'Israel' },
    { code: 'IT', es: 'Italia',                           en: 'Italy' },
    { code: 'JM', es: 'Jamaica',                          en: 'Jamaica' },
    { code: 'JP', es: 'Japón',                            en: 'Japan' },
    { code: 'JE', es: 'Jersey',                           en: 'Jersey' },
    { code: 'JO', es: 'Jordania',                         en: 'Jordan' },
    { code: 'KZ', es: 'Kazajistán',                       en: 'Kazakhstan' },
    { code: 'KE', es: 'Kenia',                            en: 'Kenya' },
    { code: 'KG', es: 'Kirguistán',                       en: 'Kyrgyzstan' },
    { code: 'KI', es: 'Kiribati',                         en: 'Kiribati' },
    { code: 'KW', es: 'Kuwait',                           en: 'Kuwait' },
    { code: 'LA', es: 'Laos',                             en: 'Laos' },
    { code: 'LS', es: 'Lesoto',                           en: 'Lesotho' },
    { code: 'LV', es: 'Letonia',                          en: 'Latvia' },
    { code: 'LB', es: 'Líbano',                           en: 'Lebanon' },
    { code: 'LR', es: 'Liberia',                          en: 'Liberia' },
    { code: 'LY', es: 'Libia',                            en: 'Libya' },
    { code: 'LI', es: 'Liechtenstein',                    en: 'Liechtenstein' },
    { code: 'LT', es: 'Lituania',                         en: 'Lithuania' },
    { code: 'LU', es: 'Luxemburgo',                       en: 'Luxembourg' },
    { code: 'MO', es: 'Macao',                            en: 'Macao' },
    { code: 'MK', es: 'Macedonia del Norte',              en: 'North Macedonia' },
    { code: 'MG', es: 'Madagascar',                       en: 'Madagascar' },
    { code: 'MY', es: 'Malasia',                          en: 'Malaysia' },
    { code: 'MW', es: 'Malaui',                           en: 'Malawi' },
    { code: 'MV', es: 'Maldivas',                         en: 'Maldives' },
    { code: 'ML', es: 'Malí',                             en: 'Mali' },
    { code: 'MT', es: 'Malta',                            en: 'Malta' },
    { code: 'MA', es: 'Marruecos',                        en: 'Morocco' },
    { code: 'MQ', es: 'Martinica',                        en: 'Martinique' },
    { code: 'MU', es: 'Mauricio',                         en: 'Mauritius' },
    { code: 'MR', es: 'Mauritania',                       en: 'Mauritania' },
    { code: 'YT', es: 'Mayotte',                          en: 'Mayotte' },
    { code: 'FM', es: 'Micronesia',                       en: 'Micronesia' },
    { code: 'MD', es: 'Moldavia',                         en: 'Moldova' },
    { code: 'MC', es: 'Mónaco',                           en: 'Monaco' },
    { code: 'MN', es: 'Mongolia',                         en: 'Mongolia' },
    { code: 'ME', es: 'Montenegro',                       en: 'Montenegro' },
    { code: 'MS', es: 'Montserrat',                       en: 'Montserrat' },
    { code: 'MZ', es: 'Mozambique',                       en: 'Mozambique' },
    { code: 'NA', es: 'Namibia',                          en: 'Namibia' },
    { code: 'NR', es: 'Nauru',                            en: 'Nauru' },
    { code: 'NP', es: 'Nepal',                            en: 'Nepal' },
    { code: 'NI', es: 'Nicaragua',                        en: 'Nicaragua' },
    { code: 'NE', es: 'Níger',                            en: 'Niger' },
    { code: 'NG', es: 'Nigeria',                          en: 'Nigeria' },
    { code: 'NU', es: 'Niue',                             en: 'Niue' },
    { code: 'NO', es: 'Noruega',                          en: 'Norway' },
    { code: 'NC', es: 'Nueva Caledonia',                  en: 'New Caledonia' },
    { code: 'NZ', es: 'Nueva Zelanda',                    en: 'New Zealand' },
    { code: 'OM', es: 'Omán',                             en: 'Oman' },
    { code: 'NL', es: 'Países Bajos',                     en: 'Netherlands' },
    { code: 'PK', es: 'Pakistán',                         en: 'Pakistan' },
    { code: 'PW', es: 'Palaos',                           en: 'Palau' },
    { code: 'PS', es: 'Palestina',                        en: 'Palestine' },
    { code: 'PA', es: 'Panamá',                           en: 'Panama' },
    { code: 'PG', es: 'Papúa Nueva Guinea',               en: 'Papua New Guinea' },
    { code: 'PF', es: 'Polinesia Francesa',               en: 'French Polynesia' },
    { code: 'PL', es: 'Polonia',                          en: 'Poland' },
    { code: 'PT', es: 'Portugal',                         en: 'Portugal' },
    { code: 'PR', es: 'Puerto Rico',                      en: 'Puerto Rico' },
    { code: 'GB', es: 'Reino Unido',                      en: 'United Kingdom' },
    { code: 'CF', es: 'República Centroafricana',         en: 'Central African Republic' },
    { code: 'CZ', es: 'República Checa',                  en: 'Czech Republic' },
    { code: 'DO', es: 'República Dominicana',             en: 'Dominican Republic' },
    { code: 'RE', es: 'Reunión',                          en: 'Réunion' },
    { code: 'RW', es: 'Ruanda',                           en: 'Rwanda' },
    { code: 'RO', es: 'Rumania',                          en: 'Romania' },
    { code: 'RU', es: 'Rusia',                            en: 'Russia' },
    { code: 'EH', es: 'Sáhara Occidental',                en: 'Western Sahara' },
    { code: 'WS', es: 'Samoa',                            en: 'Samoa' },
    { code: 'AS', es: 'Samoa Americana',                  en: 'American Samoa' },
    { code: 'BL', es: 'San Bartolomé',                    en: 'Saint Barthélemy' },
    { code: 'KN', es: 'San Cristóbal y Nieves',           en: 'Saint Kitts and Nevis' },
    { code: 'SM', es: 'San Marino',                       en: 'San Marino' },
    { code: 'MF', es: 'San Martín (parte francesa)',      en: 'Saint Martin' },
    { code: 'SX', es: 'Sint Maarten (parte neerlandesa)', en: 'Sint Maarten' },
    { code: 'PM', es: 'San Pedro y Miquelón',             en: 'Saint Pierre and Miquelon' },
    { code: 'VC', es: 'San Vicente y las Granadinas',     en: 'Saint Vincent and the Grenadines' },
    { code: 'SH', es: 'Santa Elena',                      en: 'Saint Helena' },
    { code: 'LC', es: 'Santa Lucía',                      en: 'Saint Lucia' },
    { code: 'ST', es: 'Santo Tomé y Príncipe',            en: 'São Tomé and Príncipe' },
    { code: 'SN', es: 'Senegal',                          en: 'Senegal' },
    { code: 'RS', es: 'Serbia',                           en: 'Serbia' },
    { code: 'SC', es: 'Seychelles',                       en: 'Seychelles' },
    { code: 'SL', es: 'Sierra Leona',                     en: 'Sierra Leone' },
    { code: 'SG', es: 'Singapur',                         en: 'Singapore' },
    { code: 'SY', es: 'Siria',                            en: 'Syria' },
    { code: 'SO', es: 'Somalia',                          en: 'Somalia' },
    { code: 'LK', es: 'Sri Lanka',                        en: 'Sri Lanka' },
    { code: 'SZ', es: 'Suazilandia (Esuatini)',           en: 'Eswatini' },
    { code: 'ZA', es: 'Sudáfrica',                        en: 'South Africa' },
    { code: 'SD', es: 'Sudán',                            en: 'Sudan' },
    { code: 'SS', es: 'Sudán del Sur',                    en: 'South Sudan' },
    { code: 'SE', es: 'Suecia',                           en: 'Sweden' },
    { code: 'CH', es: 'Suiza',                            en: 'Switzerland' },
    { code: 'SR', es: 'Surinam',                          en: 'Suriname' },
    { code: 'TH', es: 'Tailandia',                        en: 'Thailand' },
    { code: 'TW', es: 'Taiwán',                           en: 'Taiwan' },
    { code: 'TZ', es: 'Tanzania',                         en: 'Tanzania' },
    { code: 'TJ', es: 'Tayikistán',                       en: 'Tajikistan' },
    { code: 'TL', es: 'Timor Oriental',                   en: 'Timor-Leste' },
    { code: 'TG', es: 'Togo',                             en: 'Togo' },
    { code: 'TK', es: 'Tokelau',                          en: 'Tokelau' },
    { code: 'TO', es: 'Tonga',                            en: 'Tonga' },
    { code: 'TT', es: 'Trinidad y Tobago',                en: 'Trinidad and Tobago' },
    { code: 'TN', es: 'Túnez',                            en: 'Tunisia' },
    { code: 'TM', es: 'Turkmenistán',                     en: 'Turkmenistan' },
    { code: 'TR', es: 'Turquía',                          en: 'Turkey' },
    { code: 'TV', es: 'Tuvalu',                           en: 'Tuvalu' },
    { code: 'UA', es: 'Ucrania',                          en: 'Ukraine' },
    { code: 'UG', es: 'Uganda',                           en: 'Uganda' },
    { code: 'UZ', es: 'Uzbekistán',                       en: 'Uzbekistan' },
    { code: 'VU', es: 'Vanuatu',                          en: 'Vanuatu' },
    { code: 'VE', es: 'Venezuela',                        en: 'Venezuela' },
    { code: 'VN', es: 'Vietnam',                          en: 'Vietnam' },
    { code: 'WF', es: 'Wallis y Futuna',                  en: 'Wallis and Futuna' },
    { code: 'YE', es: 'Yemen',                            en: 'Yemen' },
    { code: 'DJ', es: 'Yibuti',                           en: 'Djibouti' },
    { code: 'ZM', es: 'Zambia',                           en: 'Zambia' },
    { code: 'ZW', es: 'Zimbabue',                         en: 'Zimbabwe' }
  ];

  /**
   * Pobla un <select> con la lista de países.
   * @param {HTMLSelectElement} selectEl
   * @param {'es'|'en'} lang
   */
  function populateCountrySelect(selectEl, lang) {
    if (!selectEl) return;
    var L = (lang === 'en') ? 'en' : 'es';
    var prevValue = selectEl.value;
    var placeholderTxt = (L === 'en') ? 'Country' : 'País';

    selectEl.innerHTML = '';

    var placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = placeholderTxt;
    placeholder.disabled = true;
    placeholder.selected = !prevValue;
    selectEl.appendChild(placeholder);

    var top = COUNTRIES.filter(function (c) { return c.priority === 1; });
    var rest = COUNTRIES.filter(function (c) { return c.priority !== 1; })
      .slice()
      .sort(function (a, b) { return a[L].localeCompare(b[L], L); });

    top.forEach(function (c) {
      var o = document.createElement('option');
      o.value = c.code;
      o.textContent = c[L];
      selectEl.appendChild(o);
    });

    var sep = document.createElement('option');
    sep.disabled = true;
    sep.textContent = '──────────';
    selectEl.appendChild(sep);

    rest.forEach(function (c) {
      var o = document.createElement('option');
      o.value = c.code;
      o.textContent = c[L];
      selectEl.appendChild(o);
    });

    if (prevValue) selectEl.value = prevValue;
  }

  /**
   * Devuelve el nombre del país en el idioma indicado a partir de su code.
   */
  function countryNameByCode(code, lang) {
    var L = (lang === 'en') ? 'en' : 'es';
    for (var i = 0; i < COUNTRIES.length; i++) {
      if (COUNTRIES[i].code === code) return COUNTRIES[i][L];
    }
    return code;
  }

  w.COUNTRIES = COUNTRIES;
  w.populateCountrySelect = populateCountrySelect;
  w.countryNameByCode = countryNameByCode;
})(window);
