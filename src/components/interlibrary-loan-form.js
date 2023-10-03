import "./styles.css";
import React from "react";
// import { createRoot } from "react-dom/client";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { navigate } from "gatsby";

const requestDetailsContent = {
  __html: "<div id='detailsPlaceholder'>Please select a material type first.",
};

const initialValues = {
  firstName: "",
  lastName: "",
  email: "",
  borrowerType: "",
  materialType: "",
  additionalInformation: "",
  bookTitle: "",
  bookAuthor: "",
  bookISBN: "",
  bookChapterTitle: "",
  bookChapterAuthor: "",
  bookChapterBookTitle: "",
  bookChapterISBN: "",
  journalTitle: "",
  journalArticleTitle: "",
  journalArticleAuthor: "",
  journalArticleVolumeIssue: "",
  journalArticleDate: "",
  journalArticlePages: "",
  journalArticleDOI: "",
  journalArticlePMID: "",
  dissertationTitle: "",
  dissertationAuthor: "",
  dissertationAdditionalInfo: "",
  otherMaterialRequestInfo: "",
};

const SignInSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  borrowerType: Yup.string().required("Borrower type is required."),
  materialType: Yup.string().required("Material type is required."),
});

const onSubmit = async (values) => {
  let dataPackage = {
    userDetails: {},
    requestDetails: {},
    additionalInformation: "",
  };
  /* i feel dirty bc of what follows */
  dataPackage.userDetails.firstName = {
    value: values.firstName,
    display: "First Name",
  };
  dataPackage.userDetails.lastName = {
    value: values.lastName,
    display: "Last Name",
  };
  dataPackage.userDetails.email = { value: values.email, display: "Email" };
  dataPackage.userDetails.borrowerType = {
    value: values.borrowerType,
    display: "Borrower Type",
  };
  dataPackage.additionalInformation = {
    value: values?.additionalInformation || "",
    display: "Additional Information",
  };
  dataPackage.requestDetails.materialType = values.materialType;
  if (values.materialType === "Book") {
    dataPackage.requestDetails.materialType = {
      value: "Book",
      display: "Book",
    };
    dataPackage.requestDetails.bookTitle = {
      value: values.bookTitle,
      display: "Book Title",
    };
    dataPackage.requestDetails.bookAuthor = {
      value: values.bookAuthor,
      display: "Author",
    };
    dataPackage.requestDetails.bookISBN = {
      value: values.bookISBN,
      display: "ISBN",
    };
  }
  if (values.materialType === "BookChapter") {
    dataPackage.requestDetails.materialType = {
      value: "BookChapter",
      display: "Book Chapter",
    };
    dataPackage.requestDetails.bookChapterBookTitle = {
      value: values.bookChapterBookTitle,
      display: "Book Title",
    };
    dataPackage.requestDetails.bookChapterAuthor = {
      value: values.bookChapterAuthor,
      display: "Chapter Author",
    };
    dataPackage.requestDetails.bookChapterTitle = {
      value: values.bookChapterTitle,
      display: "Chapter Title",
    };
    dataPackage.requestDetails.bookChapterISBN = {
      value: values.bookChapterISBN,
      display: "ISBN",
    };
  }
  if (values.materialType === "JournalArticle") {
    dataPackage.requestDetails.materialType = {
      value: "JournalArticle",
      display: "Journal Article",
    };
    dataPackage.requestDetails.journalTitle = {
      value: values.journalTitle,
      display: "Journal Title",
    };
    dataPackage.requestDetails.journalArticleTitle = {
      value: values.journalArticleTitle,
      display: "Article Title",
    };
    dataPackage.requestDetails.journalArticleAuthor = {
      value: values.journalArticleAuthor,
      display: "Article Author(s)",
    };
    dataPackage.requestDetails.journalArticleVolumeIssue = {
      value: values.journalArticleVolumeIssue,
      display: "Volume/Issue",
    };
    dataPackage.requestDetails.journalArticleDate = {
      value: values.journalArticleDate,
      display: "Date",
    };
    dataPackage.requestDetails.journalArticlePages = {
      value: values.journalArticlePages,
      display: "Pages",
    };
    dataPackage.requestDetails.journalArticleDOI = {
      value: values.journalArticleDOI,
      display: "DOI",
    };
    dataPackage.requestDetails.journalArticlePMID = {
      value: values.journalArticlePMID,
      display: "PMID",
    };
  }
  if (values.materialType === "DissertationThesis") {
    dataPackage.requestDetails.materialType = {
      value: "DissertationThesis",
      display: "Dissertation/Thesis",
    };
    dataPackage.requestDetails.dissertationTitle = {
      value: values.dissertationTitle,
      display: "Title",
    };
    dataPackage.requestDetails.dissertationAuthor = {
      value: values.dissertationAuthor,
      display: "Author(s)",
    };
    dataPackage.requestDetails.dissertationAdditionalInfo = {
      value: values.dissertationAdditionalInfo,
      display: "Additional Information",
    };
  }
  if (values.materialType === "Other") {
    dataPackage.requestDetails.materialType = {
      value: "Other",
      display: "Other",
    };
    dataPackage.requestDetails.otherMaterialRequestInfo = {
      value: values.otherMaterialRequestInfo,
      display: "Request Information",
    };
  }

  console.log(JSON.stringify(dataPackage, null, 2));

  // fetch("http://localhost:3013/interlibrary-loan-request", {
  fetch("https://rmc-library-server.up.railway.app/interlibrary-loan-request", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dataPackage),
  })
    .then((response) => {
      if (!response.ok) {
        console.log("promise rejected");
        return Promise.reject(response);
      }
      return response.text();
    })
    .then((data) => {
      console.log("Success");
      console.log(data);
      // window.location.href = "https://www.rocky.edu/library";
      navigate("/success");
      // alert("Success!");
    })
    .catch((error) => {
      if (typeof error.json === "function") {
        error
          .json()
          .then((jsonError) => {
            console.log("Json error from API");
            console.log(jsonError);
            // alert("Request failed. Please contact ill@rocky.edu");
            navigate("/error");
          })
          .catch((genericError) => {
            console.log("Generic error from API");
            console.log(error.statusText);
            // alert("Request failed. Please contact ill@rocky.edu");
            navigate("/error");
          });
      } else {
        console.log("Fetch error");
        console.log(error);
        // alert("Request failed. Please contact ill@rocky.edu");
        navigate("/error");
      }
    });
};

const InterlibraryLoanForm = () => (
  <div>
    <h2>Interlibrary Loan Form</h2>
    <Formik
      initialValues={initialValues}
      validationSchema={SignInSchema}
      onSubmit={onSubmit}
    >
      {({ values, errors, touched }) => (
        <Form>
          <h3>Contact Information</h3>
          <label htmlFor="firstName">First Name</label>
          <Field id="firstName" name="firstName" type="text" />
          <ErrorMessage
            name="firstName"
            render={(msg) => <div className="error">{msg}</div>}
          />
          <label htmlFor="lastName">Last Name</label>
          <Field id="lastName" name="lastName" type="text" />
          <ErrorMessage
            name="lastName"
            render={(msg) => <div className="error">{msg}</div>}
          />
          <label htmlFor="email">Email</label>
          <Field id="email" name="email" type="email" />{" "}
          <ErrorMessage
            name="email"
            render={(msg) => <div className="error">{msg}</div>}
          />
          {/* 
            Multiple checkboxes with the same name attribute, but different
            value attributes will be considered a "checkbox group". Formik will automagically
            bind the checked values to a single array for your benefit. All the add and remove
            logic will be taken care of for you.
          */}
          {/* <div id="borrower-type">Borrower Type</div>
          <div role="group" aria-labelledby="borrower-type">
            <label>
              <Field type="checkbox" name="checked" value="One" />
              One
            </label>
            <label>
              <Field type="checkbox" name="checked" value="Two" />
              Two
            </label>
            <label>
              <Field type="checkbox" name="checked" value="Three" />
              Three
            </label>
          </div> */}
          <h3 id="borrowerType">Borrower Type</h3>
          <div role="group" aria-labelledby="borrowerType">
            <label>
              <Field type="radio" name="borrowerType" value="Student" />
              Student
            </label>
            <label>
              <Field type="radio" name="borrowerType" value="Faculty" />
              Faculty
            </label>
            <label>
              <Field type="radio" name="borrowerType" value="Staff" />
              Staff
            </label>
            <label>
              <Field type="radio" name="borrowerType" value="Alumni" />
              Alumni
            </label>
            <label>
              <Field type="radio" name="borrowerType" value="Other" />
              Other
            </label>
          </div>{" "}
          <ErrorMessage
            name="borrowerType"
            render={(msg) => <div className="error">{msg}</div>}
          />
          <h3 id="materialType">Material Type</h3>
          <div role="group" aria-labelledby="materialType">
            <label>
              <Field type="radio" name="materialType" value="JournalArticle" />
              Journal Article
            </label>

            <label>
              <Field type="radio" name="materialType" value="Book" />
              Book
            </label>
            <label>
              <Field type="radio" name="materialType" value="BookChapter" />
              Book Chapter
            </label>

            <label>
              <Field
                type="radio"
                name="materialType"
                value="DissertationThesis"
              />
              Dissertation or Thesis
            </label>
            {/* <label>
              <Field
                type="radio"
                name="materialType"
                value="NewspaperMagazine"
              />
              Newspaper or Magazine
            </label> */}
            <label>
              <Field type="radio" name="materialType" value="Other" />
              Other
            </label>
            <ErrorMessage
              name="materialType"
              render={(msg) => <div className="error">{msg}</div>}
            />
          </div>
          <div>
            <h3 htmlFor="requestDetails">Request Details</h3>
            {/* None Selected */}
            {values.materialType === "" ? (
              <div dangerouslySetInnerHTML={requestDetailsContent} />
            ) : null}
            {/* Book Request Fields */}
            {values.materialType === "Book" && (
              <fieldset className="form-group">
                <h4>Book Request</h4>
                <label htmlFor="bookTitle">Book Title</label>
                <Field id="bookTitle" name="bookTitle" type="text" />

                <label htmlFor="bookAuthor">Book Author(s)</label>
                <Field id="bookAuthor" name="bookAuthor" type="text" />

                <label htmlFor="bookISBN">
                  ISBN <span className="lessEmphasis">(if available)</span>
                </label>
                <Field id="bookISBN" name="bookISBN" type="text" />
              </fieldset>
            )}
            {/* Book Chapter Request Fields */}
            {values.materialType === "BookChapter" && (
              <fieldset className="field-group">
                <h4>Book Chapter Request</h4>
                <label htmlFor="bookChapterBookTitle">Book Title</label>
                <Field
                  id="bookChapterBookTitle"
                  name="bookChapterBookTitle"
                  type="text"
                />
                <label htmlFor="bookChapterAuthor">Book Author(s)</label>
                <Field
                  id="bookChapterAuthor"
                  name="bookChapterAuthor"
                  type="text"
                />
                <label htmlFor="bookChapterTitle">Chapter Title</label>
                <Field
                  id="bookChapterTitle"
                  name="bookChapterTitle"
                  type="text"
                />

                <label htmlFor="bookChapterISBN">
                  ISBN <span className="lessEmphasis">(if available)</span>
                </label>
                <Field
                  id="bookChapterISBN"
                  name="bookChapterISBN"
                  type="text"
                />
              </fieldset>
            )}

            {/* Journal article request fields */}
            {values.materialType === "JournalArticle" && (
              <fieldset className="field-group">
                <h4>Journal Article Request</h4>
                <label htmlFor="journalTitle">Journal Title</label>
                <Field id="journalTitle" name="journalTitle" type="text" />

                <label htmlFor="journalArticleTitle">Article Title</label>
                <Field
                  id="journalArticleTitle"
                  name="journalArticleTitle"
                  type="text"
                />
                <label htmlFor="journalArticleAuthor">Article Author(s)</label>
                <Field
                  id="journalArticleAuthor"
                  name="journalArticleAuthor"
                  type="text"
                />
                <label htmlFor="journalArticleVolumeIssue">
                  Volume and/or Issue
                </label>
                <Field
                  id="journalArticleVolumeIssue"
                  name="journalArticleVolumeIssue"
                  type="text"
                />

                <label htmlFor="journalArticleDate">Date</label>
                <Field
                  id="journalArticleDate"
                  name="journalArticleDate"
                  type="text"
                />
                <label htmlFor="journalArticlePages">Page(s)</label>
                <Field
                  id="journalArticlePages"
                  name="journalArticlePages"
                  type="text"
                />
                <label htmlFor="journalArticleDOI">
                  DOI <span className="lessEmphasis">(if available)</span>
                </label>
                <Field
                  id="journalArticleDOI"
                  name="journalArticleDOI"
                  type="text"
                />
                <label htmlFor="journalArticlePMID">
                  PMID <span className="lessEmphasis">(if from PubMed)</span>
                </label>
                <Field
                  id="journalArticlePMID"
                  name="journalArticlePMID"
                  type="text"
                />
              </fieldset>
            )}
            {/* Dissertation or Thesis Request Fields */}
            {values.materialType === "DissertationThesis" && (
              <fieldset className="fieldGroup">
                <h4>Dissertation or Thesis Request</h4>
                <label htmlFor="dissertationTitle">Title</label>
                <Field
                  id="dissertationTitle"
                  name="dissertationTitle"
                  type="text"
                />
                <label htmlFor="dissertationAuthor">Author(s)</label>
                <Field
                  id="dissertationAuthor"
                  name="dissertationAuthor"
                  type="text"
                />
                <label htmlFor="dissertationAdditionalInfo">
                  Additional Information
                </label>
                <Field
                  id="dissertationAdditionalInformation"
                  name="dissertationAdditionalInformation"
                  as="textarea"
                />
              </fieldset>
            )}
            {/* "Other" request fields */}
            {values.materialType === "Other" && (
              <fieldset className="fieldGroup">
                <h4>Request for Other Materials</h4>

                <label htmlFor="otherMaterialRequestInfo">
                  Request Information
                </label>
                <Field
                  id="otherMaterialRequestInformation"
                  name="otherMaterialRequestInformation"
                  as="textarea"
                />
              </fieldset>
            )}
          </div>
          <h3 htmlFor="additionalInformation">Additional Information</h3>
          <Field
            id="additionalInformation"
            name="additionalInformation"
            as="textarea"
            placeholder=""
          />
          <br />
          <button type="submit">Submit</button> <br />
          {Object.values(errors).map((msg) => (
            <>{<div className="error">{msg}</div>}</>
          ))}
        </Form>
      )}
    </Formik>
  </div>
);

// const container = document.getElementById("root");
// const root = createRoot(container);
// root.render(<InterlibraryLoanForm />);
export default InterlibraryLoanForm;
