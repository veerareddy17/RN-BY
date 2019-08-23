import React from 'react';

import { Text } from "react-native";
import style from '../style/styles';

export const Error = ({ error, touched }) =>
    error && touched ? <Text style={style.errorStyle} > {error}</Text> : null;