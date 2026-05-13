import React, { useContext, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { AppContext } from '../context/AppContext';
import { colors } from '../theme/colors';
import { MonthSelector } from '../components/MonthSelector';
import { Card } from '../components/Card';
import { PieChart } from 'react-native-gifted-charts';

export const InsightsScreen = () => {
  const { state } = useContext(AppContext);

  const chartData = useMemo(() => {
    const expenses = state.transactions.filter(t => t.type === 'expense');
    
    // Group by category
    const categoryTotals: Record<string, number> = {};
    expenses.forEach(t => {
      if (!categoryTotals[t.category]) categoryTotals[t.category] = 0;
      categoryTotals[t.category] += t.amount;
    });

    // Create chart data array
    return Object.keys(categoryTotals).map((key, index) => ({
      value: categoryTotals[key],
      color: colors.chartColors[index % colors.chartColors.length],
      text: key,
    })).sort((a, b) => b.value - a.value); // Sort by highest
  }, [state.transactions]);

  const totalExpense = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <ScrollView style={styles.container}>
      <MonthSelector />
      
      <Card style={styles.chartCard}>
        <Text style={styles.cardTitle}>Expense Breakdown</Text>
        
        {chartData.length > 0 ? (
          <View style={styles.chartContainer}>
            <PieChart
              data={chartData}
              donut
              showGradient={false} // Flat design
              semiCircle={false}
              radius={100}
              innerRadius={70}
              innerCircleColor={colors.surface}
              centerLabelComponent={() => {
                return (
                  <View style={{justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={{fontSize: 22, color: colors.text, fontWeight: 'bold'}}>
                      ₹{totalExpense.toFixed(0)}
                    </Text>
                    <Text style={{fontSize: 14, color: colors.textSecondary}}>Total</Text>
                  </View>
                );
              }}
            />
            
            <View style={styles.legendContainer}>
              {chartData.map((item, index) => (
                <View key={index} style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: item.color }]} />
                  <Text style={styles.legendText}>{item.text} (₹{item.value.toFixed(0)})</Text>
                </View>
              ))}
            </View>
          </View>
        ) : (
          <Text style={styles.emptyText}>No expenses this month.</Text>
        )}
      </Card>
      
      <Card style={styles.insightCard}>
        <Text style={styles.cardTitle}>Smart Insights</Text>
        {chartData.length > 0 ? (
          <>
            <Text style={styles.insightText}>
              • Your highest expense is <Text style={{fontWeight: 'bold'}}>{chartData[0].text}</Text> at ₹{chartData[0].value.toFixed(2)}.
            </Text>
            {chartData.length > 1 && (
              <Text style={styles.insightText}>
                • You could save more by reducing your spending on {chartData[1].text}.
              </Text>
            )}
          </>
        ) : (
          <Text style={styles.insightText}>Not enough data to generate insights yet.</Text>
        )}
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 16,
  },
  chartCard: {
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  chartContainer: {
    alignItems: 'center',
    width: '100%',
  },
  legendContainer: {
    width: '100%',
    marginTop: 24,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  emptyText: {
    color: colors.textSecondary,
    marginVertical: 20,
  },
  insightCard: {
    marginTop: 8,
    marginBottom: 24,
  },
  insightText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 24,
    marginBottom: 8,
  },
});
