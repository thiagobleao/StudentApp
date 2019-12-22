import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Alert
} from 'react-native';
import Realm from'realm';
import styles from './styles';
import StudentSchema from './data';
import StudentForm from './studentForm';
import ActionButton from '../components/ActionButton';
import StudentCard from './studentCard';

//Utils
import * as utils from '../utils';

//Constants
const ERROR_SAVE = 'Um erro ocorreu ao salvar os dados do estudante. Por favor tente novamente.';
const ERROR_UPDATE = 'Um erro ocorreu ao salvar os dados do estudante. Por favor tente novamente.';
const ERROR_DELETE = 'Um erro ocorreu ao excluir o estudante. Por favor tente novamente.';
const SUCCESS_ADD = 'Novo estudante adicionado com sucesso.'
const SUCCESS_UPDATE = 'Dados atualizados com sucesso.'
const SUCCESS_DELETE = 'Exclusão realizada.';
const WARNING_DELETE = 'Esta ação é irreverssível. Tem certeza de que deseja deletar '

export default class StudentList extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      realm: null,
      _aStudentList: [],
      _oActiveStudent: null,
      _bShowForm: false,
      _oDefaultStudentInfo: {
        key: '',
        name:  '',
        birthday: '',
        grade_of_admission: '',
        address_cep: '',
        address_line1: '',
        address_number: '',
        address_line2: '',
        address_neighborhood: '',
        address_city: '',
        address_state: '',
        mother_name: '',
        mother_cpf: '',
        preferencial_payment_date: '',
      },
      _refreshing: false
    };
  }

  componentDidMount() {
    this._initData();
  }
  
  _initData = async() => {
    await Realm.open({schema: [StudentSchema], schemaVersion: 4})
    .then(realm => {
      this.setState({ realm})
    })
    .catch(error => {
      console.log(error);
    });

    this._getData()
  }

  _refreshList = () => {
    this._getData();
  }

  _addNewStudent = () => {
    this.setState({ 
      _bShowForm: true,
      _oActiveStudent: JSON.parse(JSON.stringify(this.state._oDefaultStudentInfo))
    })
  }

  _onEdit = (oActiveData) => {
    this.setState({ 
      _bShowForm: true,
      _oActiveStudent: {...oActiveData}
    })
  }

  _getData = () => {
    const oStudentList = this.state.realm.objects('Student').sorted('name');
    this.setState({ _aStudentList: [...oStudentList] })
  }

  _onCancel = () => {
    this._hideForm()
  }

  _onSave = async(value) => {
    let bIsSaved = await this._writeToStore(value);
    if(bIsSaved){
      Alert.alert(
        'Success',
        this.state._oActiveStudent.key === '' ? SUCCESS_ADD : SUCCESS_UPDATE,
        [{text: 'OK', onPress: this._hideForm}],
        { cancelable: false }
      )
    }
    else{
      Alert.alert(
        'Error',
        value.key === '' ? ERROR_SAVE : ERROR_UPDATE,
        [{text: 'OK', onPress: ()=>{}}],
        { cancelable: false }
      )
    }
  }

  _onDelete = (oData) => {
    const oName =  oData.name
    Alert.alert(
      'Warning',
      WARNING_DELETE + oName + ' ?',
      [
          {text: 'NÃO', onPress: () => {}},
          {text: 'SIM', onPress: () => {this._deleteData(oData, oName)} },
      ],
          { cancelable: false }
    )
  }

  _deleteData = async(oData, oName) => {
    let bFlag = await this._writeToStore(oData, true);
    if(bFlag){
      Alert.alert(
        'Success',
        SUCCESS_DELETE + oName,
        [{text: 'OK', onPress: this._hideForm}],
        { cancelable: false }
      )
    }
    else{
      Alert.alert(
        'Error',
        ERROR_DELETE,
        [{text: 'OK', onPress: ()=>{}}],
        { cancelable: false }
      )
    }
  }

  _hideForm = () => {
    this.setState({ 
      _bShowForm: false,
      _oActiveStudent: null
    })
  }

  //Realm CRUD
  _writeToStore = async (oData, bDelelete = false) => {
    try{
      var bUpdateFlag = false;
      const realm = this.state.realm;
      var iKey = '';
      //Delete Key
      if(bDelelete){
        iKey=oData.key;
        bUpdateFlag = true;
      }
      //Add Key
      else if(this.state._oActiveStudent.key === ''){
        iKey = String(this.state._aStudentList.length);
      }
      //Modify Key
      else{
        iKey = String(this.state._oActiveStudent.key);
          bUpdateFlag = true;
      }
      
      await realm.write(() => {
        let oStudent = realm.create('Student', {
          key: iKey,
          name: oData.name || '',
          birthday: utils.convertDateToString(oData.birthday)  || '',
          grade_of_admission: oData.grade_of_admission || '',
          address_cep: oData.address_cep || '',
          address_line1: oData.address_line1 || '',
          address_number: oData.address_number || '',
          address_line2: oData.address_line2 || '',
          address_neighborhood: oData.address_neighborhood || '',
          address_city: oData.address_city || '',
          address_state: oData.address_state || '',
          mother_name: oData.mother_name || '',
          mother_cpf: oData.mother_cpf || '',
          preferencial_payment_date: utils.convertDateToString(oData.preferencial_payment_date)  || '',
        }, bUpdateFlag);

        //Delete Action
        if(bDelelete){
          realm.delete(oStudent);
        }
      });
      this._getData();
      return true;
    }
    
    catch(exception){
      console.log('exception: ' + exception.message)
      return false;
    }
  }

  render() {
    const iListLen = this.state._aStudentList.length;

    if(this.state._bShowForm){
      return(
        <StudentForm
          title={this.state._oActiveStudent.key === '' ? 'Adicionar novo estudante' : 'Alterar perfil do estudante' }
          visible={this.state._bShowForm}
          onCancel={this._onCancel}
          onSave={this._onSave}
          activeData={this.state._oActiveStudent}
        />
      )
    }
    else{
      const oListHeader = (
        <View style={styles.header.container}>
          <Text style={styles.header.txtTitle}>
            Meus Estudantes
          </Text>
        </View>
      )

      const oList = (
        <FlatList
            getItemLayout={this._getItemLayout}
            initialNumToRender={2}
            refreshing={this.state._refreshing}
            onRefresh={() => {this._refreshList()}}
            ref={(ref) => { this.flatListRef = ref; }}
            data={this.state._aStudentList}
            renderItem={({item}) =>
              <StudentCard
                data={item}
                onEdit={this._onEdit}
                onDelete={this._onDelete}
              />
            }
        />
      )
      return (
        <View style={styles.container}>
          {
            iListLen > 0 ?
              <View style={{flex:1}}>
                {oListHeader}
                <View style={styles.body}>
                  {oList}
                </View>
              </View>
            :
            <TouchableOpacity
              style={styles.contEmpty}
              onPress={this._addNewStudent}>
              <Text style={styles.txtDefault}>
                Nenhum estudante encontrado. Toque em qualquer lugar para adicionar um novo.
              </Text>
            </TouchableOpacity>
          }
          <ActionButton onPress={this._addNewStudent}/>
        </View>
      );
    }
  }
}
