import React, { useState, useEffect, useCallback } from 'react';
import { Text, View, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker'
import {
  Button, 
  Card,
  Subheading,
  Paragraph,
  TextInput,
  Title,
} from 'react-native-paper';
import get from 'lodash.get';
import set from 'lodash.set';

import { createAxios } from '../../utils/axios';
import { snakeToTitle, camelToSnake } from '../../utils/string';
import { schemaToJSON } from '../../utils/json';

import style from './style';

const RecordDetails = ({
  token,
  guid,
  workspaceId,
  containerGuid,
  transformation,
  options,
  styles,
}) => {
  const [record, setRecord] = useState({});
  const [recordTypes, setRecordTypes] = React.useState([]);
  const [selectedRecordType, setSelectedRecordType] = React.useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [timing, setTiming] = useState(0);
  const [serverTime, setServerTime] = useState(0);

  const axios = createAxios(token);

  const fetchRecord = useCallback(async () => {
    let url;

    switch (transformation) {
      case 'encrypt':
        url = `/record/${guid}`;
        break;
      case 'anonymize':
        url = `/record/${guid}/anonymize`;
        break;
      case 'redact':
        url = `/record/${guid}/redact`;
        break;
      case 'decrypt':
        url = `/record/${guid}/decrypt`;
        break;
      default:
        url = `/record/${guid}`;
        break;
    }

    try {
      const startTime = new Date().getTime();
      const { data, headers } = await axios.get(url);
      headers['server-timing'].split(';').some((option) => {
        if (option.includes('dur=')) {
          const [, value] = option.split('=');
          setServerTime(value);
          return true;
        }
        return false;
      })
      setRecord(data.record);
      setTiming(new Date().getTime() - startTime);
    } catch (error) {
      console.log('Error in requesting: ', error);
    }
    setIsLoaded(true);
  }, [guid]);

  const fetchRecordType = React.useCallback(async () => {
    try {
      const startTime = new Date().getTime();
      const { data } = await axios.get('/record_type');
      setRecordTypes(data);
      setSelectedRecordType(data[0].id);
      setTiming(new Date().getTime() - startTime);
    } catch (error) {
      console.log('Error in requesting: ', error);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (guid) {
      fetchRecord();
    } else {
      fetchRecordType();
    }
  }, [fetchRecord, fetchRecordType, guid]);

  useEffect(() => {
    const recordType = recordTypes.find((type) => type.id === +selectedRecordType);
    if (recordType) {
      setRecord(schemaToJSON(recordType.schema));
    }
  }, [selectedRecordType]);

  const handleChangeRecord = (path) => (value) => {
    const newRecord = { ...record };
    set(newRecord, path, value);
    setRecord(newRecord);
  };

  const handleDelete = async () => {
    await axios.delete(`/record/${guid}`);
    setRecord(Object.keys(record).reduce((newRecord, key) => {
      newRecord[key] = '';
      return newRecord;
    }, {}));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    if (guid) {
      await axios.patch(`/record/${guid}`, {
        record,
        record_type_id: record.record_type_id,
        workspace_id: record.workspace_id,
        container_guid: record.container_guid,
      });
    } else {
      if (workspaceId && containerGuid) {
        await axios.create('/record', {
          record,
          record_type_id: selectedRecordType,
          workspace_id: workspaceId,
          container_guid: containerGuid,
        });
      }
    }
    setSubmitting(false);
  };

  const handleChangeRecordType = (newRecordType) => {
    setSelectedRecordType(newRecordType);
  };

  const renderRecord = (parentKey) => {
    const value = get(record, parentKey);
    const paths = parentKey.split('.');
    if (typeof value === 'object') {
      return (
        <View style={style.formGroup}>
          <View key={`${parentKey}_key`}>
            <Subheading>
              {snakeToTitle(camelToSnake(paths[paths.length - 1]))}
            </Subheading>
          </View>
          <View key={`${parentKey}_value`}>
            {Object.keys(value).map((childKey) => (
              renderRecord(`${parentKey}.${childKey}`)
            ))}
          </View>
        </View>
      )
    } else {
      return (
        <View style={style.formGroup}>
          <View key={`${parentKey}_key`}>
            <Subheading>
              {snakeToTitle(camelToSnake(paths[paths.length - 1]))}
            </Subheading>
          </View>
          <View key={`${parentKey}_value`}>
            <TextInput
              mode={styles?.inputVariant}
              value={value}
              editable={options.updatable}
              onChangeText={handleChangeRecord(parentKey)}
            />
          </View>
        </View>
      )
    }
  }

  if (!isLoaded) {
    return <Text>Loading...</Text>;
  }

  return (
    <ScrollView>
      <Card 
        elevation={options.elevation}
        style={{
          backgroundColor: styles?.backgroundColor || '#fff',
          color: styles?.fontColor || 'rgba(0, 0, 0, 0.87)',
        }}
      >
        <Card.Content>
          <View style={style.header}>
            <Title>Record Summary</Title>
            <Button mode="contained" onPress={handleDelete}>Delete</Button>
          </View>
          {!guid && (
            <View style={style.select}>
              <Subheading>
                Record Types
              </Subheading>
              <Picker
                selectedValue={selectedRecordType}
                onValueChange={handleChangeRecordType}
                style={style.picker}
              >
                {recordTypes.map((recordType) => (
                  <Picker.Item key={recordType.id} label={recordType.name} value={recordType.id} />
                ))}
              </Picker>
            </View>
          )}
          <View style={style.content}>
            {Object.keys(record).map((key) => (
              renderRecord(key)
            ))}
          </View>
          <View style={style.footer}>
            {options.displayTiming && (
              <Paragraph style={style.displayTiming}>
                {`Round-trip time ${timing} ms Server time ${serverTime} ms`}
              </Paragraph>
            )}
            {options.updatable && (
              <Button mode="contained" disabled={submitting} onClick={handleSubmit}>
                {guid ? 'Save' : 'Create'}
              </Button>
            )}
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  )
};

export default RecordDetails;
