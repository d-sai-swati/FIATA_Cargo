import React, { useState } from 'react';
import { View, Button, Text, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const DatePickerComponent = () => {
    const [date, setDate] = useState(new Date());
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const onChange = (event, selectedDate) => {
        setDatePickerVisibility(Platform.OS === 'ios'); // Keep picker open for iOS until user confirms
        if (selectedDate) {
            const formattedDate = selectedDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
            console.log("Formatted date sent to backend:", formattedDate);
            setDate(selectedDate);
        }
    };

    return (
        <View style={{ padding: 20 }}>
            <Text>Selected Date: {date.toISOString().split('T')[0]}</Text>
            <Button title="Show Date Picker" onPress={showDatePicker} />
            {isDatePickerVisible && (
                <DateTimePicker
                    value={date}
                    mode="date" // Only show date picker
                    display="default"
                    onChange={onChange}
                    minimumDate={new Date()}
                />
            )}
        </View>
    );
};

export default DatePickerComponent;
