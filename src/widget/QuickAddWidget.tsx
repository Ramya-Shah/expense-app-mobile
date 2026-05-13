import React from 'react';
import { FlexWidget, TextWidget } from 'react-native-android-widget';

export function QuickAddWidget() {
  return (
    <FlexWidget
      style={{
        height: 'match_parent',
        width: 'match_parent',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#093C5D',
        borderRadius: 16,
      }}
      clickAction="OPEN_URI"
      clickActionData={{ uri: 'expensetracker://add' }}
    >
      <FlexWidget
        style={{
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: '#5DF8D8',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 8,
        }}
      >
        <TextWidget
          text="+"
          style={{
            fontSize: 32,
            color: '#093C5D',
          }}
        />
      </FlexWidget>
      <TextWidget
        text="Add Expense"
        style={{
          fontSize: 14,
          color: '#FFFFFF',
          fontWeight: 'bold',
        }}
      />
    </FlexWidget>
  );
}
