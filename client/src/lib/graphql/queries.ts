import {
  ApolloClient,
  ApolloLink,
  concat,
  createHttpLink,
  gql,
  InMemoryCache,
} from "@apollo/client";
import { getAccessToken } from "../auth";
import { graphql } from "../../generated/gql";

// "presetConfig": {
//   "fragmentMasking": false
// } using for fix fragment type error

const httpLink = createHttpLink({ uri: "http://localhost:9000/graphql" });

const authLink = new ApolloLink((operation, forward) => {
  const accessToken = getAccessToken();
  if (accessToken) {
    operation.setContext({
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  }
  return forward(operation);
});

export const apolloClient = new ApolloClient({
  link: concat(authLink, httpLink),
  cache: new InMemoryCache(),
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const jobDetailFragment = gql`
  fragment JobDetail on Job {
    id
    date
    title
    company {
      id
      name
    }
    description
  }
`;

// export const companyByIdQuery = gql`
export const companyByIdQuery = graphql(`
  # use it for ts
  query CompanyById($id: ID!) {
    company(id: $id) {
      id
      name
      description
      jobs {
        id
        date
        title
      }
    }
  }
`);

// export const jobByIdQuery = gql`
export const jobByIdQuery = graphql(`
  query JobById($id: ID!) {
    job(id: $id) {
      ...JobDetail
    }
  }
`);
// ${jobDetailFragment} graphql dont need fragment

// export const jobsQuery = gql`
export const jobsQuery = graphql(`
  query Jobs($limit: Int, $offset: Int) {
    jobs(limit: $limit, offset: $offset) {
      items {
        id
        date
        title
        company {
          id
          name
        }
      }
      totalCount
    }
  }
`);

// export const createJobMutation = gql`
export const createJobMutation = graphql(`
  mutation CreateJob($input: CreateJobInput!) {
    job: createJob(input: $input) {
      ...JobDetail
    }
  }
`);
// ${jobDetailFragment} graphql dont need fragment
