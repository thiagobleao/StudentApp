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
    preferencial_payment_date: {type: 'date'},
  }
};

export default StudentSchema;
