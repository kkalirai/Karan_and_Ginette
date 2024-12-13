'use client';

import { Formik } from 'formik';
import React, { memo, useRef } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import * as Yup from 'yup';
import JoditEditor from 'jodit-react';
//import { useRouter } from 'next/navigation';

import { useLoading, useRequest } from '@/components/App';
import { KEYPAIR } from '@/types/interfaces';
import { confirmDialog, toastr } from '@/utils/helpers';

const FormikSchema = Yup.object().shape({
  title: Yup.string().trim().min(2, 'Too Short!').max(50, 'Too Long!').required('Please provide title.'),
  slug: Yup.string().trim().max(50, 'Too Long!').required('Please provide slug.'),
  metaTitle: Yup.string().trim().max(255, 'Too Long!').required('Please provide meta title.'),
  subTitle: Yup.string().trim().max(255, 'Too Long!').required('Please provide subtitle.'),
  metaKeyword: Yup.string().trim().max(255, 'Too Long!').required('Please provide meta keyword.'),
  shortDescription: Yup.string().trim().max(255, 'Too Long!').required('Please provide short description.'),
  metaDescription: Yup.string().trim().max(255, 'Too Long!').required('Please provide meta description.'),
  content: Yup.string().trim().required('Please provide content.'),
});

interface PROPS {
  state: {
    pageDetail?: KEYPAIR;
    edit?: string;
  };
  dispatch: React.Dispatch<KEYPAIR>;
  handleClose: () => void;
}

function PageForm(props: PROPS) {
  const { request, loading } = useRequest();
  const { ButtonLoader } = useLoading();
  const { state, dispatch } = props;
  const editor = useRef(null);
  //const router = useRouter();

  const handleSubmit = async (values: KEYPAIR) => {
    dispatch({ isEditLoading: true });
    const confirm = await confirmDialog('Are you sure you want to save these changes?', 'Save changes');
    if (confirm) {
      values.status = values?.status === '1' ? true : false;
      const req = !state.edit
        ? ((await request('createPage', values)) as any)
        : ((await request('updatePage', { ...values, id: state?.pageDetail?.id })) as any);
      if (req) {
        toastr('The page has been successfully saved.', 'success', !state.edit ? 'New Page created' : 'Page updated');
        dispatch({ isEditLoading: false, userSelected: [] });
        // const slug = req.title;
        // router.push(`/${slug}`);
        return props.handleClose();
      }
    }
  };

  return (
    <div className="canvasData">
      <h3>Page details</h3>
      <Formik
        enableReinitialize={true}
        initialValues={{
          title: (state?.pageDetail?.title || '') as string,
          slug: (state?.pageDetail?.slug || '') as string,
          metaTitle: (state?.pageDetail?.metaTitle || '') as string,
          subTitle: (state?.pageDetail?.subTitle || '') as string,
          metaKeyword: (state?.pageDetail?.metaKeyword || '') as string,
          shortDescription: (state?.pageDetail?.shortDescription || '') as string,
          metaDescription: (state?.pageDetail?.metaDescription || '') as string,
          content: (state?.pageDetail?.content || '') as string,
          status: state?.pageDetail?.status ? state.pageDetail.status.toString() : '0',
        }}
        validateOnChange={false}
        validateOnBlur={false}
        validationSchema={FormikSchema}
        onSubmit={handleSubmit}
      >
        {({ handleSubmit, handleChange, setFieldValue, values, errors, touched }) => (
          <div className="inner">
            <div className="topSection">
              <Form id="user-form" noValidate onSubmit={handleSubmit}>
                <div className="row details border-0 insideSection">
                  <div className="row">
                    <div className="col-md-6">
                      <Form.Group className="mb-3">
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                          type="title"
                          name="title"
                          placeholder="Title"
                          onChange={handleChange}
                          value={values.title}
                          isInvalid={!!errors.title}
                        />
                        {errors.title && touched.title ? (
                          <Form.Control.Feedback type="invalid">{errors.title}</Form.Control.Feedback>
                        ) : null}
                      </Form.Group>
                    </div>
                    <div className="col-md-6">
                      <Form.Group className="mb-3">
                        <Form.Label>Slug</Form.Label>
                        <Form.Control
                          type="slug"
                          name="slug"
                          placeholder="Slug"
                          onChange={handleChange}
                          value={values.slug}
                          isInvalid={!!errors.slug}
                        />
                        {errors.slug && touched.slug ? (
                          <Form.Control.Feedback type="invalid">{errors.slug}</Form.Control.Feedback>
                        ) : null}
                      </Form.Group>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <Form.Group className="mb-3">
                        <Form.Label>Meta Title</Form.Label>
                        <Form.Control
                          type="metaTitle"
                          name="metaTitle"
                          placeholder="Your metaTitle"
                          onChange={handleChange}
                          value={values.metaTitle}
                          isInvalid={!!errors.subTitle}
                        />
                        {errors.metaTitle && touched.metaTitle ? (
                          <Form.Control.Feedback type="invalid">{errors.metaTitle}</Form.Control.Feedback>
                        ) : null}
                      </Form.Group>
                    </div>
                    <div className="col-md-6">
                      <Form.Group className="mb-3">
                        <Form.Label>Meta Keyword</Form.Label>
                        <Form.Control
                          type="metaKeyword"
                          name="metaKeyword"
                          placeholder="Meta Keyword"
                          onChange={handleChange}
                          value={values.metaKeyword}
                          isInvalid={!!errors.metaKeyword}
                        />
                        {errors.metaKeyword && touched.metaKeyword ? (
                          <Form.Control.Feedback type="invalid">{errors.metaKeyword}</Form.Control.Feedback>
                        ) : null}
                      </Form.Group>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <Form.Group className="mb-3">
                        <Form.Label>Short Description</Form.Label>
                        <Form.Control
                          name="shortDescription"
                          placeholder="Short Description"
                          onChange={handleChange}
                          value={values.shortDescription}
                          isInvalid={!!errors.shortDescription}
                          as="textarea"
                          rows={3}
                        />
                      </Form.Group>
                    </div>
                    <div className="col-md-6">
                      <Form.Group className="mb-3">
                        <Form.Label>Meta Description</Form.Label>
                        <Form.Control
                          name="metaDescription"
                          placeholder="Meta Description"
                          onChange={handleChange}
                          value={values.metaDescription}
                          isInvalid={!!errors.metaDescription}
                          as="textarea"
                          rows={3}
                        />
                      </Form.Group>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <Form.Group className="mb-3">
                      <Form.Label>Subtitle</Form.Label>
                      <Form.Control
                        type="subTitle"
                        name="subTitle"
                        placeholder="Subtitle"
                        onChange={handleChange}
                        value={values.subTitle}
                        isInvalid={!!errors.subTitle}
                      />
                      {errors.subTitle && touched.subTitle ? (
                        <Form.Control.Feedback type="invalid">{errors.subTitle}</Form.Control.Feedback>
                      ) : null}
                    </Form.Group>
                  </div>
                  <div className="col-md-12">
                    <Form.Group className="mb-3">
                      <Form.Label>Content</Form.Label>
                      <JoditEditor
                        ref={editor}
                        value={values.content}
                        // config={config}
                        // tabIndex={1} // tabIndex of textarea
                        onChange={val => {
                          setFieldValue('content', val);
                        }}
                      />
                      {errors.content && touched.content ? <div className="text-danger">{errors.content}</div> : null}
                    </Form.Group>
                  </div>

                  <div className="col-md-12">
                    <Form.Group className="mb-3">
                      <Form.Label>Status</Form.Label>
                      <div>
                        <Form.Check
                          type="checkbox"
                          id="status-checkbox"
                          label="Active"
                          name="status"
                          checked={values.status === '1'}
                          onChange={e => {
                            handleChange({ target: { name: 'status', value: e.target.checked ? '1' : '0' } });
                          }}
                        />
                      </div>
                      {/* {errors.status && touched.status ? (
                        <Form.Control.Feedback type="invalid">{errors.status}</Form.Control.Feedback>
                      ) : null} */}
                    </Form.Group>
                  </div>
                </div>
              </Form>
            </div>
            <div className="plr24 canvasFooter">
              <Button className="OutlineBtn fs12" onClick={props.handleClose}>
                Cancel
              </Button>
              <Button type="submit" form="user-form" className="customBtn fs12">
                {loading?.updateUser_LOADING ? ButtonLoader() : 'Save'}
              </Button>
            </div>
          </div>
        )}
      </Formik>
    </div>
  );
}

export default memo(PageForm);
