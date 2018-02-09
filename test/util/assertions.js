import { expect } from 'chai';

export function assertInvite(actual, expected) {
  expect(actual.status).to.equal(expected.status);
  expect(actual.daysFromCreationUntilExpiration).to.equal(expected.days);
  expect(actual.userInvitedId).to.equal(expected.userId);
  expect(actual.projectInvitedToId).to.equal(expected.projectId);
}
