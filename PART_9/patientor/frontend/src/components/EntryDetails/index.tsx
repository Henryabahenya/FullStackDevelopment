import React from "react";
import { Entry } from "../../types";
import { assertNever } from "../../utils/assertNever";
import HealthCheckDetails from "./HealthCheckDetails";
import OccupationalHealthcareDetails from "./OccupationalHealthcareDetails";
import HospitalDetails from "./HospitalDetails";

interface Props {
  entry: Entry;
}

const EntryDetails: React.FC<Props> = ({ entry }) => {
  switch (entry.type) {
    case "HealthCheck":
      return <HealthCheckDetails entry={entry} />;
    case "OccupationalHealthcare":
      return <OccupationalHealthcareDetails entry={entry} />;
    case "Hospital":
      return <HospitalDetails entry={entry} />;
    default:
      return assertNever(entry);
  }
};

export default EntryDetails;
