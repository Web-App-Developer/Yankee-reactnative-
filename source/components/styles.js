  
import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  root: {padding: 20, minHeight: 300},
  title: {textAlign: 'center', fontSize: 30},
  codeFieldRoot: {
    marginTop: 20,
    width: 240,
    marginLeft: 0,
    marginRight: 0,
  },
  cellRoot: {
    width: 20,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: '#60c182',
    borderBottomWidth: 2,
  },
  cellText: {
    color: '#199946',
    fontSize: 22,
    textAlign: 'center',
  },
  focusCell: {
    borderBottomColor: '#007AFF',
    borderBottomWidth: 2,
  },
});