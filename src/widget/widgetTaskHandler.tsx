import React from 'react';
import type { WidgetTaskHandlerProps } from 'react-native-android-widget';
import { QuickAddWidget } from './QuickAddWidget';

const widgetName = 'QuickAdd';

export async function widgetTaskHandler(props: WidgetTaskHandlerProps) {
  const widgetInfo = props.widgetInfo;
  const widgetAction = props.widgetAction;

  switch (widgetAction) {
    case 'WIDGET_ADDED':
    case 'WIDGET_UPDATE':
    case 'WIDGET_RESIZED':
      props.renderWidget(<QuickAddWidget />);
      break;

    case 'WIDGET_DELETED':
      // Clean up if needed
      break;

    case 'WIDGET_CLICK':
      // Click actions are handled via clickAction="OPEN_URI" in the widget JSX
      break;

    default:
      break;
  }
}
