//Schema
const StudentSchema = {
  name: 'Student',
  primaryKey: 'key',
  properties: {
    key: 'string', //primary key
    name:  'string',
    birthday: {type: 'date'},
    grade_of_admission: 'string',
    address_cep: 'string',
    address_line1: 'string',
    address_number: 'int',
    address_line2: 'string',
    address_neighborhood: 'string',
    address_city: 'string',
    address_state: 'string',
    mother_name: 'string',
    mother_cpf: 'string',
    preferencial_payment_day: 'int',
  }
};

export default StudentSchema;

//Enum Type options
export const GRADE_OPTIONS = {
  Ano1: '1º Ano',
  Ano2: '2º Ano',
  Ano3: '3º Ano',
  Ano4: '4º Ano',
  Ano5: '5º Ano',
  Ano6: '6º Ano',
  Ano7: '7º Ano',
  Ano8: '8º Ano',
  Ano9: '9º Ano'
}

export const STATE_OPTIONS = {
  0: 'AC',
  1: 'AL',
  2: 'AM',
  3: 'AP',
  4: 'BA',
  5: 'CE',
  6: 'DF',
  7: 'ES',
  8: 'GO',
  9: 'MA',
  10: 'MG',
  11: 'MS',
  12: 'MT',
  13: 'PA',
  14: 'PB',
  15: 'PE',
  16: 'PI',
  17: 'PR',
  18: 'RJ',
  19: 'RN',
  20: 'RO',
  21: 'RR',
  22: 'RS',
  23: 'SC',
  24: 'SE',
  25: 'SP',
  26: 'TO',
}