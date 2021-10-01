import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, DataTable, Paragraph, Provider as PaperProvider } from 'react-native-paper';
import { Text, View, ScrollView } from 'react-native';
import get from 'lodash.get';

import { createAxios } from '../../utils/axios';
import theme from '../../theme';

import style from './style';

const optionsPerPage = [5, 10, 20];

const capitalize = (str) => str.replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())));

const camelToSnake = (key) => key.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();

const RecordList = ({ token, containerGuid, recordTypeId, options }) => {
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [timing, setTiming] = useState(0);
  const [serverTime, setServerTime] = useState(0);
  
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  const axios = createAxios(token);

  const fetchRecords = useCallback(async () => {
    setIsLoading(true);

    try {
      const startTime = new Date().getTime();
      const { data: containerRecords, headers: getHeaders } = await axios.get(`/container/${containerGuid}/records`, {
        params: {
          limit: pageSize,
          offset: currentPage * pageSize,
        },
      });
      setTotalCount(+getHeaders['x-total-count']);
      
      const recordGuids = containerRecords
        .filter(({ record_type_id }) => record_type_id === recordTypeId)
        .map(({ guid }) => guid);

      const { data, headers } = await axios.post('/record/bulk', recordGuids);

      headers['server-timing'].split(';').some((option) => {
        if (option.includes('dur=')) {
          const [, value] = option.split('=');
          setServerTime(value);
          return true;
        }
        return false;
      })

      setRecords(Object.values(data)
        .map((record) => ({
          ...record,
          tags: (record.tags || []).map(({ tag }) => tag).join(', '),
          record_metadata: (record.record_metadata || []).map(({ key, value }) => `${key}: ${value}`).join(', '),
        }))
      );
      setTiming(new Date().getTime() - startTime);
    } catch (error) {
      console.log('Error in requesting: ', error);
    }
    setIsLoading(false);
  }, [pageSize, currentPage]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const recordColumns = useMemo(() => {
    const usedProps = {};
    const values = [];

    const getColumns = (record, path) => {
      Object.keys(record).forEach((key) => {
        if (!usedProps[`${path}.${key}`]) {
          if (typeof record[key] !== 'object') {
            values.push({
              title: capitalize(camelToSnake(key).split('_').join(' ')),
              field: `${path}.${key}`,
            });
            usedProps[`${path}.${key}`] = true;
          } else if (record[key]) {
            getColumns(record[key], `${path}.${key}`);
          }
        }
      });
    };

    records.forEach(({ record }) => {
      getColumns(record, 'record');
    });

    values.push({
      title: 'Tags',
      field: 'tags',
    });
    values.push({
      title: 'Metadata',
      field: 'metadata',
    });
    return values;
  }, [records]);

  return (
    <PaperProvider theme={theme}>
      <ScrollView>
        <Card elevation={options?.elevation || 3}>
          <Card.Title title={options?.title || 'Record List'} />
          {isLoading ? (
            <View style={style.loading}>
              <Text>Loading...</Text>
            </View>
          ) : (
            <Card.Content>
              <DataTable>
                <DataTable.Header>
                  {recordColumns.map(({ title, field }) => (
                    <DataTable.Title key={field}>{title}</DataTable.Title>
                  ))}
                </DataTable.Header>
    
                {records.map((record) => (
                  <DataTable.Row key={record.id}>
                    {recordColumns.map(({ field }) => (
                      <DataTable.Cell key={field}>
                        {get(record, field)}
                      </DataTable.Cell>
                    ))}
                  </DataTable.Row>
                ))}
                
                <DataTable.Pagination
                  page={currentPage}
                  numberOfPages={Math.ceil(totalCount / pageSize)}
                  label={`${currentPage * pageSize + 1}-${(currentPage + 1) * pageSize} of ${totalCount}`}
                  optionsPerPage={optionsPerPage}
                  itemsPerPage={pageSize}
                  showFastPagination
                  optionsLabel={'Rows per page'}
                  setItemsPerPage={setPageSize}
                  onPageChange={(page) => setCurrentPage(page)}
                />
              </DataTable>
            </Card.Content>
          )}

          {options?.displayTiming && !isLoading && (
            <Paragraph style={style.displayTiming}>
              {`Round-trip time ${timing} ms Server time ${serverTime} ms`}
            </Paragraph>
          )}
        </Card>
      </ScrollView>
    </PaperProvider>
  );
};

export default RecordList;
