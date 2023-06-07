import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { selectUser } from 'app/store/userSlice';
import { useSelector, useDispatch } from 'react-redux';
import { DetailTitleBar } from 'app/theme-layouts/mainLayout/components';
import { useParams, useLocation } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import css from 'assets/css/pageManagement.module.css';
import FileUpload from 'app/theme-layouts/shared-components/uploader/FileUploader';
import { useEffect, useState, useRef } from 'react';
import convertFile from "app/utils/convertFile"
import { toast } from 'react-toastify';
import { updatePageTem } from '../store/PageTemplateSlice';

function PageManagement() {
  // const routeParams = useParams();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const location = useLocation();
  const [profileImg, setProfileImg] = useState(null);
  const [thumbnailImg, setThumbnailImg] = useState(null);
  const popolSection = useRef(null);
  const profileSection = useRef(null);

  const schema = yup.object().shape({
    popolName: yup.string().required('포폴명은 필수 정보 입니다.'),
    thumbnail: yup.string(), // 파일여부?
    mainColor: yup.string().notOneOf([' ', null], '메인색상을 선택해 주세요.'),
    fakeName: yup.string(),
    email: yup.string().email('이메일 형식으로 입력해주세요.').required('이메일은 필수 정보 입니다.'),
    phone: yup.string().matches(/^[0-9]{9,11}$/i, "번호는 '-' 없이 9~11자리 번호로 입력해주세요"),
    title: yup.string(),
    profile: yup.string(), // 파일여부?
  });

  const methods = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema),
  });
  const { reset, watch, control, getValues, setValue, onChange, setError, formState, trigger } =
    methods;
  const { errors, isValid, dirtyFields } = formState;
  const form = watch();

  const handleFileSelect = (arg) => {
    if (arg.file.type.startsWith('image/')) {
      switch (arg.name) {
        case "thumbnail":
          setThumbnailImg(arg.file);
          popolSection.current.style.height = "auto"
          break;
        case "profile":
          setProfileImg(arg.file);
          profileSection.current.style.height = "auto"
          break;
        default:
          console.log("default case")
      }
      setValue(arg.name, arg.file.name);
    } else {
      toast.warning("이미지 파일을 선택해주세요!");
    }
  };

  const saveBtnClick = () => {
    const param = {
      fields: getValues(),
      files: {
        profileImg,
        thumbnailImg,
      },
    }
    toast.info("개발중입니다 ㅠ");
    // dispatch(updatePageTem(param))
    //   .then(({ payload }) => {
    //     console.log(payload)
    //   })
    //   .catch((error) => {
    //     toast.error("포폴 업데이트 실패");
    //   })
  }

  const sectionTitleClick = (e) => {
    const el = e.currentTarget;
    el.classList.toggle("active")
    if (el.classList.contains("active")) {
      el.childNodes[1].style.transform = "rotate(0deg)"
      el.nextSibling.style.height = `${el.nextSibling.childNodes[0].offsetHeight}px`;
    } else {
      el.childNodes[1].style.transform = "rotate(180deg)"
      el.nextSibling.style.height = "0px";
    }
  }
  useEffect(() => {
    const { popolName, thumbnail, mainColor, fakeName, email, phone, title, profileImg: profile, ptId } = location.state.template
    setValue('popolName', popolName);
    setValue('thumbnail', thumbnail);
    setValue('mainColor', mainColor);
    setValue('fakeName', fakeName);
    setValue('email', email);
    setValue('phone', phone.replaceAll("-", ""));
    setValue('title', title);
    setValue('profile', profile);
    if (thumbnail !== null && thumbnail !== undefined && thumbnail !== "") {
      const remoteImageUrl = `https://site.mypopol.com/${ptId}/${user.userId}/img/${thumbnail}`;
      const fileName = thumbnail;
      convertFile(remoteImageUrl, fileName, function (error, file) {
        if (error) {
          toast.error(error);
          return;
        }
        setThumbnailImg(file)
      });
    };
    if (profile !== null && profile !== undefined && profile !== "") {
      const remoteImageUrl = `https://site.mypopol.com/${ptId}/${user.userId}/img/${profile}`;
      const fileName = profile;
      convertFile(remoteImageUrl, fileName, function (error, file) {
        if (error) {
          toast.error(error);
          return;
        }
        setProfileImg(file)
      });
    };
  }, [])
  return (
    <div className={`section__grid__wrap content common__detail ${css.page__tem__wrap}`}>
      <DetailTitleBar
        saveBtnClick={saveBtnClick}
        trigger={trigger}
      />
      <section>
        <div className={`${css.detail__section} section__inner`}>
          <div onClick={(e) => {
            sectionTitleClick(e);
          }} className={`${css.title__bar} top line`}>
            <p className="f__medium normal__title">포폴 정보</p>
            <span className={css.arrow__btn} />
          </div>
          <div ref={popolSection} className={`${css.section__content}`}>
            <div className='inner'>
              <div className={css.list__item}>
                <p className='f__medium'>썸네일 이미지</p>
                {
                  thumbnailImg === null || !thumbnailImg.type.startsWith('image/') ? (
                    <div>
                      <FileUpload name="thumbnail" onFileSelect={handleFileSelect} height="200px" control={control} />
                    </div>
                  ) : (
                    <>
                      <div className={css.thumbnail__img__box}>
                        <img src={URL.createObjectURL(thumbnailImg)} alt={thumbnailImg.name} />
                      </div>
                      <Controller
                        name="thumbnail"
                        control={control}
                        render={({ field }) => (
                          <div className={css.file__status}>
                            <p className='f__regular'>{field.value}</p>
                            <span onClick={(e) => {
                              setThumbnailImg(null);
                              popolSection.current.style.height = "auto"
                              setValue("thumbnail", "");
                            }} className='img__remove' />
                          </div>
                        )}
                      />
                    </>
                  )
                }
              </div>
              <div className={css.list__item}>
                <Controller
                  name="popolName"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      className="mb-24"
                      label="포폴명"
                      autoFocus
                      type="text"
                      error={!!errors.popolName}
                      helperText={errors?.popolName?.message}
                      variant="outlined"
                      required
                      fullWidth
                    />
                  )}
                />
              </div>
              <div className={css.list__item}>
                <p className='f__medium'>메인 색상</p>
                <ul className={css.color__item__wrap}>
                  {
                    ['rgb(255, 182, 59)', 'rgb(75, 135, 224)', 'rgb(75, 224, 149)'].map((color) => (
                      <li onClick={(e) => {
                        setValue('mainColor', color);
                      }} className={getValues().mainColor === color ? css.selected__color : ""} key={color}>
                        <span style={{ backgroundColor: color, boxShadow: `0 10px 14px -5px ${color}` }} />
                      </li>
                    ))
                  }
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section >
      <section>
        <div className={`${css.detail__section} section__inner`}>
          <div onClick={(e) => {
            sectionTitleClick(e);
          }} className={`${css.title__bar} top line`}>
            <p className="f__medium normal__title">프로필 정보</p>
            <span className={css.arrow__btn} />
          </div>
          <div ref={profileSection} className={`${css.section__content}`}>
            <div className='inner'>
              <div className={css.list__item}>
                <p className='f__medium'>프로필 이미지</p>
                {
                  profileImg === null || !profileImg.type.startsWith('image/') ? (
                    <div>
                      <FileUpload name="profile" onFileSelect={handleFileSelect} height="160px" control={control} />
                    </div>
                  ) : (
                    <>
                      <div className={css.profile__img__box}>
                        <img src={URL.createObjectURL(profileImg)} alt={profileImg.name} />
                      </div>
                      <Controller
                        name="profile"
                        control={control}
                        render={({ field }) => (
                          <div className={css.file__status}>
                            <p className='f__regular'>{field.value}</p>
                            <span onClick={(e) => {
                              setProfileImg(null);
                              profileSection.current.style.height = "auto"
                              setValue("profile", "");
                            }} className='img__remove' />
                          </div>
                        )}
                      />
                    </>
                  )
                }
              </div>
              <div className={css.list__item}>
                <Controller
                  name="fakeName"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      className="mb-24"
                      label="예명"
                      autoFocus
                      type="text"
                      error={!!errors.fakeName}
                      helperText={errors?.fakeName?.message}
                      variant="outlined"
                      fullWidth
                    />
                  )}
                />
              </div>
              <div className={css.list__item}>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      className="mb-24"
                      label="이메일"
                      autoFocus
                      type="text"
                      error={!!errors.email}
                      helperText={errors?.email?.message}
                      variant="outlined"
                      required
                      fullWidth
                    />
                  )}
                />
              </div>
              <div className={css.list__item}>
                <Controller
                  name="phone"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      className="mb-24"
                      label="전화번호"
                      autoFocus
                      type="text"
                      error={!!errors.phone}
                      helperText={errors?.phone?.message}
                      variant="outlined"
                      required
                      fullWidth
                    />
                  )}
                />
              </div>
              <div className={css.list__item}>
                <Controller
                  name="title"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      className="mb-24"
                      fullWidth
                      label="인사글"
                      multiline
                      rows={3}
                      variant="outlined"
                    />
                  )}
                />
              </div>
              <div className={css.list__item}>
                <p className='f__medium'>SNS 정보</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className={`${css.detail__section} section__inner`}>
          <div onClick={(e) => {
            sectionTitleClick(e);
          }} className={`${css.title__bar} top line`}>
            <p className="f__medium normal__title">웹툰 정보</p>
            <span className={css.arrow__btn} />
          </div>
          <div className={`${css.section__content}`}>
            <div className='inner'>
              {/* <p>layout test</p>
              <p>layout test</p>
              <p>layout test</p>
              <p>layout test</p>
              <p>layout test</p>
              <p>layout test</p>
              <p>layout test</p>
              <p>layout test</p>
              <p>layout test</p>
              <p>layout test</p>
              <p>layout test</p>
              <p>layout test</p>
              <p>layout test</p>
              <p>layout test</p>
              <p>layout test</p> */}
            </div>
          </div>
        </div>
      </section>
    </div >
  );
}

export default PageManagement;