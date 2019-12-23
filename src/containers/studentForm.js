
import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Keyboard
} from 'react-native';
import t from 'tcomb-form-native'; 
import {Enum} from 'enumify';

//Styles
import styles from './styles';

//Custom Component
import FormContainer from '../components/FormContainer';

//Custom tcomb
import {CustomSelectPickerTemplate} from '../customTcomb/selectPickerTemplate';
import {CustomCEPTemplate} from '../customTcomb/cepTextInputTemplate';
import {CustomCPFTemplate} from '../customTcomb/cpfTextInputTemplate';
import {CustomEstadosTemplate} from '../customTcomb/selectEstadosTemplate';
import {estados} from './estados-cidades/estados-cidades.json';

//Utils
import * as utils from '../utils';
import stylesheet from '../customTcomb/styles';

//Constants
import {GRADE_OPTIONS, STATE_OPTIONS} from './data';
const ERROR_MESSAGE = '*Campo Obrigatório';
const INVALID_CPF_MESSAGE = '*CPF Invalido';
const INVALID_CEP_MESSAGE = '*CEP Invalido';
const INVALID_PAYMENT_MESSAGE = '*Dia para pagamento inválido, escolha entre os dias 1 e 31';
const Form = t.form.Form;

export default class StudentForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            _oStudent: {
                name: this.props.activeData.name || '',
                birthday: this.props.activeData.birthday ? new Date(this.props.activeData.birthday) : null,
                grade_of_admission: this.props.activeData.grade_of_admission || '',
                address_cep: this.props.activeData.address_cep || '',
                address_line1: this.props.activeData.address_line1 || '',
                address_number: this.props.activeData.address_number || '',
                address_line2: this.props.activeData.address_line2 || '',
                address_neighborhood: this.props.activeData.address_neighborhood || '',
                address_city: this.props.activeData.address_city || '',
                address_state: this.props.activeData.address_state || '',
                mother_name: this.props.activeData.mother_name || '',
                mother_cpf: this.props.activeData.mother_cpf || '',
                preferencial_payment_day: this.props.activeData.preferencial_payment_day || ''     
            },
            
            _uf: estados,
            _selectedValueEstado: this.props.activeData.address_state || '', 

            _oOriginalData: null
        };
    }

    componentDidMount(){
        this.setState({ 
            _oOriginalData: {...this.state._oStudent},
            _uf: {...this.state._uf},
            _selectedValueEstado: this.state._oStudent.address_state,
        });
    }

    // renderValueChangeEstado = (value) => {
    //     this.setState({
    //         _selectedValueEstado: value.address_city
    //     })
    //   }


    //   renderValueChangeCidade = (value) => {
    //     console.warn(value)
    //     this.setState({
    //         _selectedValueCidade: value
    //     })
    //   }

    _onChange = (value) => {
        //console.log('value: ' + value.address_cep)
        let oStudent = {...this.state._oStudent};
        oStudent.name = value.name || '';
        oStudent.birthday = value.birthday  || null;
        oStudent.grade_of_admission = value.grade_of_admission  || '';
        oStudent.address_cep = value.address_cep  || '';
        oStudent.address_line1 = value.address_line1  || '';
        oStudent.address_number = value.address_number  || '';
        oStudent.address_line2 = value.address_line2  || '';
        oStudent.address_neighborhood = value.address_neighborhood  || '';
        oStudent.address_city = value.address_city  || '';
        oStudent.address_state = value.address_state  || '';
        oStudent.mother_name = value.mother_name  || '';
        oStudent.mother_cpf = value.mother_cpf  || '';
        oStudent.preferencial_payment_day = value.preferencial_payment_day  || '';
        this.setState({ _oStudent: oStudent, _selectedValueEstado: value.address_state })
    }

    _onSubmit = () => {
        Keyboard.dismiss();
        let oStudent = this.refs.form_student.getValue();

        if (oStudent) {
            this.props.onSave(oStudent);
        }
    }

    _onCancel = () => {
        Keyboard.dismiss();
        if( JSON.stringify(this.state._oStudent) === JSON.stringify(this.state._oOriginalData) ){
            this.props.onCancel()
        }
        else{
            Alert.alert(
                'Atenção',
                'Dados não salvos serão perdidos. Tem certeza de que deseja sair?',
                [
                    {text: 'Não', onPress: () => {}},
                    {text: 'Sim', onPress: () => this.props.onCancel()},
                ],
                    { cancelable: false }
            )
        }
    }
    
    
    render(){
        // console.log('GRADE_OPTIONS: ' + JSON.stringify(GRADE_OPTIONS));
        // console.log('STATE_OPTIONS: ' + JSON.stringify(STATE_OPTIONS));
        // console.log('JSON.stringify(this.state._oStudent): ' + JSON.stringify(this.state._oStudent));
        // console.log('JSON.stringify(this.state._oOriginalData): ' + JSON.stringify(this.state._oOriginalData));
        //const { selectedValueCidade, selectedValueEstado, uf } = this.state;
        //console.log('estados: ' + this.state._selectedValueEstado);
        // if  (this.state._selectedValueEstado != '' && this.state._selectedValueEstado != null) {
        //  console.log('CITY_OPTIONS: ' + JSON.stringify(this.state._uf[this.state._selectedValueEstado].cidades));
        // }
        
        const GRADE = t.enums(GRADE_OPTIONS)
        const STATE = t.enums(STATE_OPTIONS)        
        if  (this.state._selectedValueEstado != '' && this.state._selectedValueEstado != null) {
            var CITIES = t.enums.of(this.state._uf[this.state._selectedValueEstado].cidades)
        }
        else{
            var CITIES = t.enums({})
        }
       // const CITIES = t.enums(this.state._uf[this.state._selectedValueEstado].cidades)
        var OPTIONS = {
            fields: {
                name:{ 
                    label: 'Nome' ,
                    returnKeyType: 'next',
                    autoCorrect: false,
                    maxLength: 100,
                    onSubmitEditing: (event) => {this.refs.form_student.getComponent('name').refs.input.focus()},
                    error: ERROR_MESSAGE
                },
                birthday:{ 
                    label: 'Data de Nascimento',
                    mode:'date',
                    maximumDate: new Date(),
                    config:{
                        format: (strDate) => utils.convertDateToString(strDate, 'DD/MM/YYYY'),
                        defaultValueText: 'Escolha a data de nascimento'
                    },
                    error: ERROR_MESSAGE
                },
                grade_of_admission:{ 
                    template: CustomSelectPickerTemplate,
                    label: 'Ano de Admissão',
                    error: ERROR_MESSAGE
                },
                address_cep:{ 
                    template: CustomCEPTemplate,
                    label: 'CEP' ,
                    returnKeyType: 'next',
                    onSubmitEditing: (event) => {this.refs.form_student.getComponent('address_line1').refs.input.focus()},
                    error: INVALID_CEP_MESSAGE
                },
                address_line1:{ 
                    label: 'Rua' ,
                    returnKeyType: 'next',
                    maxLength: 120,
                    onSubmitEditing: (event) => {this.refs.form_student.getComponent('address_number').refs.input.focus()},
                    error: ERROR_MESSAGE
                },
                address_number:{ 
                    label: 'Número' ,
                    returnKeyType: 'next',
                    onSubmitEditing: (event) => {this.refs.form_student.getComponent('address_line2').refs.input.focus()},
                    error: ERROR_MESSAGE
                },
                address_line2:{ 
                    label: 'Complemento' ,
                    returnKeyType: 'next',
                    maxLength: 50,
                    onSubmitEditing: (event) => {this.refs.form_student.getComponent('address_neighborhood').refs.input.focus()},
                    error: ERROR_MESSAGE
                },
                address_neighborhood:{ 
                    label: 'Bairro' ,
                    returnKeyType: 'next',
                    maxLength: 100,
                    onSubmitEditing: (event) => {this.refs.form_student.getComponent('address_city').refs.input.focus()},
                    error: ERROR_MESSAGE
                },
                address_state:{ 
                    template: CustomSelectPickerTemplate,
                    label: 'Estado',
                    value: this.state._selectedValueEstado,
                    onChange: this.renderValueChangeEstado,
                    error: ERROR_MESSAGE
                },
                address_city:{ 
                    template: CustomSelectPickerTemplate,
                    label: 'Cidade' ,
                    returnKeyType: 'next',
                    onSubmitEditing: (event) => {this.refs.form_student.getComponent('address_city').refs.input.focus()},
                    error: ERROR_MESSAGE
                },
                mother_name:{ 
                    label: 'Nome da Mãe' ,
                    returnKeyType: 'next',
                    maxLength: 100,
                    onSubmitEditing: (event) => {this.refs.form_student.getComponent('mother_cpf').refs.input.focus()},
                    error: ERROR_MESSAGE
                },
                mother_cpf:{ 
                    template: CustomCPFTemplate,
                    label: 'CPF da Mãe' ,
                    returnKeyType: 'next',
                    onSubmitEditing: (event) => {this.refs.form_student.getComponent('mother_cpf').refs.input.focus()},
                    error: INVALID_CPF_MESSAGE
                },
                preferencial_payment_day:{ 
                    label: 'Dia preferencial de pagamento da mensalidade',
                    error: INVALID_PAYMENT_MESSAGE
                }
            },
            stylesheet: stylesheet
        }

        var ValidPaymentDay = t.refinement(t.Number, function (n) {
            return n >= 1 && n <= 31;
        });

        var ValidCpf = t.refinement(t.String, function (cpf) {
            cpf = cpf.replace(/[^\d]+/g,'');	
            if(cpf == '') return false;	
            // Elimina CPFs invalidos conhecidos	
            if (cpf.length != 11 || 
                cpf == "00000000000" || 
                cpf == "11111111111" || 
                cpf == "22222222222" || 
                cpf == "33333333333" || 
                cpf == "44444444444" || 
                cpf == "55555555555" || 
                cpf == "66666666666" || 
                cpf == "77777777777" || 
                cpf == "88888888888" || 
                cpf == "99999999999")
                    return false;		
            // Valida 1o digito	
            var add = 0;	
            var rev;
            var i;
            for (i=0; i < 9; i ++)		
                add += parseInt(cpf.charAt(i)) * (10 - i);	
                rev = 11 - (add % 11);	
                if (rev == 10 || rev == 11)		
                    rev = 0;	
                if (rev != parseInt(cpf.charAt(9)))		
                    return false;		
            // Valida 2o digito	
            add = 0;	
            for (i = 0; i < 10; i ++)		
                add += parseInt(cpf.charAt(i)) * (11 - i);	
            rev = 11 - (add % 11);	
            if (rev == 10 || rev == 11)	
                rev = 0;	
            if (rev != parseInt(cpf.charAt(10)))
                return false;		
            return true;   
        }); 

        var ValidCEP = t.refinement(t.String, function (strCEP) {
            var objER = /^[0-9]{2}.[0-9]{3}-[0-9]{3}$/;
 
            strCEP = strCEP.trim();
            if(strCEP.length > 0)
                {
                    if(objER.test(strCEP))
                        return true;
                    else
                        return false;
                }
            else
                return blnVazio;
        });

        var STUDENT = t.struct({
            name: t.String,
            birthday: t.Date,
            grade_of_admission: GRADE,
            address_cep: ValidCEP,
            address_line1: t.String,
            address_number: t.Number,
            address_line2: t.String,
            address_neighborhood: t.String,
            address_state: STATE,
            address_city: CITIES,
            mother_name: t.String,
            mother_cpf: ValidCpf,
            preferencial_payment_day: ValidPaymentDay
        })

        console.log('rendering form')
        return(
            <FormContainer
                onSubmit = {this._onSubmit}
                onCancel = {this._onCancel}
                padding = {35}
                title={this.props.title}>

                <Form 
                    ref='form_student'
                    type={STUDENT} 
                    onChange={this._onChange}
                    value={this.state._oStudent}
                    options={OPTIONS}/>
                
            </FormContainer>
        )
    }
}
