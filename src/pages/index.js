import * as React from "react";
import InterlibraryLoanForm from "../components/interlibrary-loan-form";
import { navigate } from "gatsby";

const IndexPage = () => {
  return (
    <main>
      <InterlibraryLoanForm></InterlibraryLoanForm>
    </main>
  );
};

export default IndexPage;

export const Head = () => <title>Interlibrary Loan Form | RMC Library</title>;
