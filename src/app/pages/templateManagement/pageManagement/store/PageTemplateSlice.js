import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const updatePageTem = createAsyncThunk(
  'templateManage/page/update',
  async (param, { dispatch, rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('fields', JSON.stringify(param.fields));
      formData.append('profileImg', param.files.profileImg);
      formData.append('thumbnailImg', param.files.thumbnailImg);
      const response = await axios.post(
        `${process.env.REACT_APP_API_HOST}/templatemanage/page/update`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return await response;
    } catch (error) {
      if (!error.response.data) {
        return rejectWithValue(error);
      }
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  // userRole: "",
  // userId: "",
  // userName: "",
};

const pageTemplateSlice = createSlice({
  name: 'pageTemplate',
  initialState,
  // extraReducers: (builder) => {
  //   builder
  //     .addCase(setUser.fulfilled, (state, action) => {
  //       return action.payload;
  //     });
  // },
});

// export const selectUser = ({ common }) => common.user;

export default pageTemplateSlice.reducer;
