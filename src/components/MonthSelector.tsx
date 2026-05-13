import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { format, parse, addMonths, subMonths } from 'date-fns';
import { AppContext } from '../context/AppContext';
import { colors } from '../theme/colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export const MonthSelector = () => {
  const { state, dispatch } = useContext(AppContext);

  const currentDate = parse(state.currentMonth, 'yyyy-MM', new Date());

  const handlePrev = () => {
    const newDate = subMonths(currentDate, 1);
    dispatch({ type: 'SET_MONTH', payload: format(newDate, 'yyyy-MM') });
  };

  const handleNext = () => {
    const newDate = addMonths(currentDate, 1);
    dispatch({ type: 'SET_MONTH', payload: format(newDate, 'yyyy-MM') });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handlePrev} style={styles.button}>
        <MaterialCommunityIcons name="chevron-left" size={24} color={colors.text} />
      </TouchableOpacity>
      
      <Text style={styles.monthText}>{format(currentDate, 'MMMM yyyy')}</Text>
      
      <TouchableOpacity onPress={handleNext} style={styles.button}>
        <MaterialCommunityIcons name="chevron-right" size={24} color={colors.text} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  button: {
    padding: 8,
  },
  monthText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
});
