import React,{useState, useImperativeHandle, forwardRef} from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const RadioPIcker = ({simType = null, onPress},ref) => {
    const [value, setValue] = useState(simType);

    const pick = (type) => {
        setValue(type);
        onPress(type);
    }

    useImperativeHandle(ref, () => ({
        setTypeValue(value){
            setValue(value);
            console.log("setting in picker:", value)
        }
    }));
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.picker} onPress={() => pick('mobicom')}>
                <View style={styles.radioCon}>
                    {value == 'mobicom' && <View style={styles.dot}/>}
                </View>
                <Text style={styles.text}>Mobicom</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.picker} onPress={() => pick('unitel')}>
                <View style={styles.radioCon}>
                    {value == 'unitel' && <View style={styles.dot}/>}
                </View>
                <Text style={styles.text}>Unitel</Text>
            </TouchableOpacity>
        </View>
    )
}

export default forwardRef(RadioPIcker);

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        // backgroundColor: 'red',
        width: '86%',
        height: 45,
        marginVertical: 15,
        alignSelf: 'center'
    },
    picker: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    radioCon: {
        borderWidth: 1,
        borderColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
        width: 25,
        height: 25,
        borderRadius: 15,
        marginRight: 10
    },
    dot: {
        width: 10,
        height: 10,
        backgroundColor: '#000',
        borderRadius: 5
    },
    text: {
        color: '#000',
        fontSize: 18,
    }
})
