/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';

import styles from './styles';
import FixedCard1 from './../components/FixedCards';

//Utils
import * as utils from '../utils';

//Constants
import {GRADE_OPTIONS, STATE_OPTIONS} from './data';

export default class StudentCard extends Component {
    constructor(props){
        super(props);
        this.state = {
            _aStudentData: []
        }
    }

    componentDidMount(){
        this._generateCardInputs();
    }

    _generateCardInputs = () => {
        let aData = 
        [
            {
                label: 'Nome',
                value: this.props.data.name
            },
            {
                label: 'Data de Nascimento',
                value: utils.convertDateToString(this.props.data.birthday, 'DD/MM/YYYY')
            },
            {
                label: 'Ano de Admissão',
                value: GRADE_OPTIONS[this.props.data.grade_of_admission]
            },,
            {
                label: 'Endereço',
                value: this.props.data.address_line1
            },,
            {
                label: 'Estado',
                value: STATE_OPTIONS[this.props.data.address_state]
            },,
            {
                label: 'Nome da Mãe',
                value: this.props.data.mother_name
            },
        ]

        this.setState({ _aStudentData: aData });
    }

    render() {
        return (
            <View style={styles.placeholder}>
                <FixedCard1
                    title={
                        this.props.data.name
                    }
                    studentData={this.props.data}
                    onEdit={(data) => this.props.onEdit(data)}
                    attributes={this.state._aStudentData}
                    onDelete={(data) => this.props.onDelete(data)}/>
            </View>
        );
    }
}
