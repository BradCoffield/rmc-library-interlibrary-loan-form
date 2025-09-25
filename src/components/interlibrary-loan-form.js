import "../styles.css";
import React, { useState } from "react";
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
  bookChapterChapterTitle: "",
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
  otherRequestInformation: "",
};

const SignInSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  borrowerType: Yup.string().required("Borrower type is required."),
  materialType: Yup.string().required("Material type is required."),
});

const onSubmit = async (values, { setSubmitting }) => {
  setSubmitting(true);
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
    value: values.additionalInformation,
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
    dataPackage.requestDetails.bookChapterChapterTitle = {
      value: values.bookChapterChapterTitle,
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
    dataPackage.requestDetails.otherRequestInformation = {
      value: values.otherRequestInformation,
      display: "Request Information",
    };
  }

  console.log(JSON.stringify(dataPackage, null, 2));

  try {
    const response = await fetch(
      "https://rmc-library-server-2023.vercel.app/interlibrary-loan-request",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataPackage),
      }
    );

    if (!response.ok) {
      // Try to extract JSON error for better logging
      try {
        const jsonError = await response.json();
        console.log("Json error from API");
        console.log(jsonError);
      } catch (_) {
        console.log("Generic error from API");
        console.log(response.statusText);
      }
      navigate("/error");
      return;
    }

    const data = await response.text();
    console.log("Success");
    console.log(data);
    navigate("/success");
  } catch (error) {
    console.log("Fetch error");
    console.log(error);
    navigate("/error");
  } finally {
    setSubmitting(false);
  }
};

const InterlibraryLoanForm = () => {
  // Inline LibKey lookup state for DOI/PMID checks
  const [lookup, setLookup] = useState({
    status: "idle", // idle | loading | done | error
    error: null,
    result: null,
    field: null, // "doi" | "pmid"
    value: "",
  });

  const validateDoi = (v) => {
    if (!v) return false;
    const s = String(v).trim();
    // Fairly permissive DOI pattern: starts with 10. and has a suffix
    return /^10\.\S+\/\S+$/i.test(s) || /^10\.\d{4,9}\/\S+$/i.test(s);
  };

  const validatePmid = (v) => {
    if (!v) return false;
    const s = String(v).trim();
    return /^\d+$/.test(s);
  };

  const checkImmediateAccess = async (field, rawValue) => {
    try {
      const value = String(rawValue || "").trim();
      if (!value) return;
      // Client-side validation
      if (field === "doi" && !validateDoi(value)) {
        setLookup({ status: "error", error: "Please enter a valid DOI (e.g., 10.xxxx/xxxxx).", result: null, field, value });
        return;
      }
      if (field === "pmid" && !validatePmid(value)) {
        setLookup({ status: "error", error: "Please enter a valid numeric PMID.", result: null, field, value });
        return;
      }

      setLookup({ status: "loading", error: null, result: null, field, value });

      const params = new URLSearchParams();
      params.set(field, value);
      params.set("include", "journal");
      const res = await fetch(`/api/libkey-lookup?${params.toString()}`);
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setLookup({ status: "error", error: `Lookup failed (${res.status}).`, result: json || null, field, value });
        return;
      }
      setLookup({ status: "done", error: null, result: json, field, value });
    } catch (err) {
      setLookup({ status: "error", error: String(err), result: null, field, value: String(rawValue || "") });
    }
  };

  const prepareFillValues = (remote) => {
    const article = remote && remote.data;
    if (!article) return null;
    const included = (remote && remote.included) || [];
    const journal = included.find((it) => it && it.type === "journals");

    const pages = article.startPage && article.endPage
      ? `${article.startPage}-${article.endPage}`
      : article.startPage || article.endPage || "";

    // Try to derive volume/issue from the link resolver URL (when configured)
    let volumeIssue = "";
    try {
      if (article.linkResolverOpenUrl) {
        const u = new URL(article.linkResolverOpenUrl);
        const vol = u.searchParams.get("volume") || "";
        const iss = u.searchParams.get("issue") || "";
        if (vol && iss) volumeIssue = `${vol}(${iss})`;
        else if (vol) volumeIssue = vol;
        else if (iss) volumeIssue = `(${iss})`;
      }
    } catch (_) {
      // ignore parsing errors and leave volumeIssue blank
    }

    return {
      journalTitle: (journal && journal.title) || "",
      journalArticleTitle: article.title || "",
      journalArticleAuthor: article.authors || "",
      journalArticleVolumeIssue: volumeIssue, // best-effort from link resolver
      journalArticleDate: article.date || "",
      journalArticlePages: pages,
      journalArticleDOI: article.doi || "",
      journalArticlePMID: article.pmid || "",
    };
  };

  const getFeedbackFor = (field, setFieldValue, currentValue) => {
    if (lookup.field !== field) return null;
    const cur = String(currentValue || "").trim();
    // Hide feedback if the associated field is empty or has changed since lookup (avoid stale results)
    if (!cur) return null;
    if (lookup.value && cur !== lookup.value) return null;

    const styleWrap = {
      marginTop: 6,
      background: "#f6f8fa",
      padding: 8,
      borderRadius: 6,
      border: "1px solid #e1e4e8",
    };
    const btn = {
      display: "inline-block",
      padding: "6px 10px",
      marginRight: 8,
      background: "#0366d6",
      color: "#fff",
      borderRadius: 4,
      textDecoration: "none",
    };
    const subtle = { color: "#586069", marginLeft: 8 };

    if (lookup.status === "loading") {
      return <div style={styleWrap}>Checking availability…</div>;
    }
    if (lookup.status === "error") {
      return (
        <div style={{ ...styleWrap, background: "#fff5f5", borderColor: "#f3b7b7" }}>
          <strong style={{ color: "#b00020" }}>Lookup error:</strong> Please double check your entry or continue requesting through Interlibrary Loan.
        </div>
      );
    }
    if (lookup.status === "done") {
      const remote = lookup.result && lookup.result.data;
      const article = remote && remote.data;
      if (!article) {
        return (
          <div style={styleWrap}>No matching article was recognized by LibKey for that {field.toUpperCase()}.</div>
        );
      }
      const available = article.availableThroughBrowzine;
      const best = article.bestIntegratorLink && article.bestIntegratorLink.bestLink;
      const bestText =
        (article.bestIntegratorLink && article.bestIntegratorLink.recommendedLinkText) ||
        (article.fullTextFile ? "Download PDF" : article.contentLocation ? "View Article" : "Access Options");
      const browzineWebLink = article.browzineWebLink;
      const resolver = article.linkResolverOpenUrl;
      const docdel = article.documentDeliveryFulfillmentUrl;

      const applyDetails = () => {
        const fill = prepareFillValues(remote);
        if (!fill) return;
        Object.entries(fill).forEach(([key, val]) => setFieldValue(key, val));
      };

      // Compact preview of values to be autofilled
      const fillPreview = prepareFillValues(remote) || {};
      const previewStyle = { marginTop: 8, padding: 8, background: "#fff", borderRadius: 6, border: "1px dashed #e1e4e8" };

      return (
        <div style={styleWrap}>
          {available ? (
            <div>
              <a href={best || article.fullTextFile || article.contentLocation || resolver || "#"} target="_blank" rel="noreferrer" style={btn}>
                {bestText}
              </a>
              {browzineWebLink && (
                <a href={browzineWebLink} target="_blank" rel="noreferrer" style={{ ...btn, background: "#6f42c1" }}>
                  View in BrowZine
                </a>
              )}
              <span style={subtle}>
                Immediate access available.
              </span>
              <div style={previewStyle}>
                <strong>Preview:</strong>
                <div>
                  {fillPreview.journalTitle ? <div><em>Journal:</em> {fillPreview.journalTitle}</div> : null}
                  {fillPreview.journalArticleTitle ? <div><em>Title:</em> {fillPreview.journalArticleTitle}</div> : null}
                  {fillPreview.journalArticleAuthor ? <div><em>Authors:</em> {fillPreview.journalArticleAuthor}</div> : null}
                  {fillPreview.journalArticleDate ? <div><em>Date:</em> {fillPreview.journalArticleDate}</div> : null}
                  {fillPreview.journalArticleVolumeIssue ? <div><em>Volume/Issue:</em> {fillPreview.journalArticleVolumeIssue}</div> : null}
                  {fillPreview.journalArticlePages ? <div><em>Pages:</em> {fillPreview.journalArticlePages}</div> : null}
                  {(fillPreview.journalArticleDOI || fillPreview.journalArticlePMID) ? (
                    <div>
                      {fillPreview.journalArticleDOI ? <span><em>DOI:</em> {fillPreview.journalArticleDOI}</span> : null}
                      {fillPreview.journalArticleDOI && fillPreview.journalArticlePMID ? " • " : null}
                      {fillPreview.journalArticlePMID ? <span><em>PMID:</em> {fillPreview.journalArticlePMID}</span> : null}
                    </div>
                  ) : null}
                </div>
              </div>
              <div style={{ marginTop: 8 }}>
                <button type="button" onClick={applyDetails}>Autofill form</button>
                <div style={{ ...subtle, marginTop: 4 }}>This fills journal title, article title, authors, date, pages, and DOI/PMID.</div>
              </div>
            </div>
          ) : (
            <div>
              {resolver && (
                <a href={resolver} target="_blank" rel="noreferrer" style={btn}>
                  Access Options
                </a>
              )}
              {docdel && (
                <a href={docdel} target="_blank" rel="noreferrer" style={{ ...btn, background: "#22863a" }}>
                  Request PDF
                </a>
              )}
              {!resolver && !docdel && (
                <span>No immediate access found for our library.</span>
              )}
              <span style={subtle}>
                Not immediately available. Please proceed with requesting via interlibrary loan.
              </span>
              <div style={previewStyle}>
                <strong>Preview:</strong>
                <div>
                  {fillPreview.journalTitle ? <div><em>Journal:</em> {fillPreview.journalTitle}</div> : null}
                  {fillPreview.journalArticleTitle ? <div><em>Title:</em> {fillPreview.journalArticleTitle}</div> : null}
                  {fillPreview.journalArticleAuthor ? <div><em>Authors:</em> {fillPreview.journalArticleAuthor}</div> : null}
                  {fillPreview.journalArticleDate ? <div><em>Date:</em> {fillPreview.journalArticleDate}</div> : null}
                  {fillPreview.journalArticlePages ? <div><em>Pages:</em> {fillPreview.journalArticlePages}</div> : null}
                  {(fillPreview.journalArticleDOI || fillPreview.journalArticlePMID) ? (
                    <div>
                      {fillPreview.journalArticleDOI ? <span><em>DOI:</em> {fillPreview.journalArticleDOI}</span> : null}
                      {fillPreview.journalArticleDOI && fillPreview.journalArticlePMID ? " • " : null}
                      {fillPreview.journalArticlePMID ? <span><em>PMID:</em> {fillPreview.journalArticlePMID}</span> : null}
                    </div>
                  ) : null}
                </div>
              </div>
              <div style={{ marginTop: 8 }}>
                <button type="button" onClick={applyDetails}>Autofill form</button>
                <div style={{ ...subtle, marginTop: 4 }}>This fills journal title, article title, authors, date, pages, and DOI/PMID.</div>
              </div>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      <Formik
        initialValues={initialValues}
        validationSchema={SignInSchema}
        onSubmit={onSubmit}
      >
        {({ values, errors, touched, isSubmitting, setFieldValue }) => (
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
                <label htmlFor="bookChapterChapterTitle">Chapter Title</label>
                <Field
                  id="bookChapterChapterTitle"
                  name="bookChapterChapterTitle"
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
                {String(values.journalArticleDOI || "").trim() ? (
                  <button
                    type="button"
                    onClick={() => checkImmediateAccess("doi", values.journalArticleDOI)}
                    style={{ marginLeft: 8 }}
                  >
                    Check for immediate access
                  </button>
                ) : null}
                {getFeedbackFor("doi", setFieldValue, values.journalArticleDOI)}
                <label htmlFor="journalArticlePMID">
                  PMID <span className="lessEmphasis">(if from PubMed)</span>
                </label>
                <Field
                  id="journalArticlePMID"
                  name="journalArticlePMID"
                  type="text"
                />
                {String(values.journalArticlePMID || "").trim() ? (
                  <button
                    type="button"
                    onClick={() => checkImmediateAccess("pmid", values.journalArticlePMID)}
                    style={{ marginLeft: 8 }}
                  >
                    Check for immediate access
                  </button>
                ) : null}
                {getFeedbackFor("pmid", setFieldValue, values.journalArticlePMID)}
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

                <label htmlFor="otherRequestInformation">
                  Request Information
                </label>
                <Field
                  id="otherRequestInformation"
                  name="otherRequestInformation"
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
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting…" : "Submit"}
          </button> <br />
          {Object.values(errors).map((msg) => (
            <>{<div className="error">{msg}</div>}</>
          ))}
          </Form>
        )}
      </Formik>
    </div>
  );
};

// const container = document.getElementById("root");
// const root = createRoot(container);
// root.render(<InterlibraryLoanForm />);
export default InterlibraryLoanForm;
