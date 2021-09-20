import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';

import RecordDetails from './components/RecordDetails';

import theme from './theme';

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <RecordDetails
        token='eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ2ZXJzaW9uIjoxLjAsInR5cGUiOiJ1c2VyLWFjY2VzcyIsInN1YnR5cGUiOiJwb3J0YWwiLCJuYW1lIjoiYXJkYUB2YW50YWdlcG9pbnQuY28iLCJpZCI6MjMsInBjcm4iOiJwY3JuOjEyMzQ1Njc4OmVudGl0eS91c2VyOjIzIiwianRpIjoiMDgxZDYxZjAtOTBkZS00MDc3LWIwN2YtZmM1OWFjNzc1MzkyIiwiZm9yX3NpdGUiOiJzdGFnaW5nLWFwaS5wcml2Y2xvdWQuY29tIiwiaXNzdWVkX3RpbWVzdGFtcCI6IjIwMjEtMDktMjBUMDE6MjM6MDkuMDc4NTExIiwic2lnbmF0dXJlX3B1YmxpY19rZXkiOiItLS0tLUJFR0lOIFBVQkxJQyBLRVktLS0tLVxuIE1JR2ZNQTBHQ1NxR1NJYjNEUUVCQVFVQUE0R05BRENCaVFLQmdRQ2JyNGI2Q1pFZktHVW40WnNkMlpKMXVYdFpcbiB0Vlg5NW1GTkM0aTM4YVVmblBER0FFWmVtOXdKb1FTYWdGbkxFQUdjSjljaEtnRXZoUVcxZ1FRRVlmTFJqeDc4XG4gNTlaMHV1SFlYWTk4OHArbDVDd0dsU0NrZmF3ZkgzMmRkVDU4OFc0VElFcUlLdmQzSlFKTlphNjdPYXNDS2VUclxuIG01UG14QTlqK1NuSXNDMmZNUUlEQVFBQlxuIC0tLS0tRU5EIFBVQkxJQyBLRVktLS0tLSIsInRhZ3MiOnsibWZhX3ByZXNlbnQiOmZhbHNlfSwiY29uZGl0aW9ucyI6eyJleHBpcmVzX2F0IjoiMjAyMS0wOS0yMFQwMTo1MzowOS4wNzg1MzAifX0.sVm_eNXflnCuBSJZAfRjyyKrentmooD4Lw59lZDGwwo'
        guid='aaaaaaaa-01c2-4e93-a55b-5653d1d0b538'
        transformation='decrypt'
        options={{
          updatable: true,
          displayTiming: true,
          elevation: 3,
        }}
      />
    </PaperProvider>
  );
}
