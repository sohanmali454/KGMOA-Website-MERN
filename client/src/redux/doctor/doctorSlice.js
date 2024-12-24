import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  formData: {
    name: "",
    place: "",
    kmcNumber: "",
    mobile: "",
    membershipType: "",
    paymentId: null,
    qrCode: null,
    registrationDateTime: null,
  },
  loading: false,
  error: null,
};

const doctorSlice = createSlice({
  name: "doctor",
  initialState,
  reducers: {
    updateFormData(state, action) {
      state.formData = { ...state.formData, ...action.payload };
    },
    resetFormData(state) {
      state.formData = initialState.formData;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
  },
});

export const { updateFormData, resetFormData, setLoading, setError } =
  doctorSlice.actions;
export default doctorSlice.reducer;
