import { module, test } from "qunit";
import { setupTest } from "ember-qunit";
import { mockUserModel } from "../../helpers/mock-data";
import { resolve } from "rsvp";

module("Unit | Model | user", function (hooks) {
    setupTest(hooks);

    test("users name properly returned when skype name is a string", async function (assert) {
        let user = mockUserModel({
            displayName: "User 1",
            owner: this.owner,
        });
        let name = await user.get("name");
        assert.equal(name, "User 1", "User name matches");
    });

    // ACE-1174
    test("users name properly returned when skype name is a promise", async function (assert) {
        let user = mockUserModel({
            displayName: "User 1",
            owner: this.owner,
        });
        function displayName() {
            return null;
        }
        displayName.get = () => resolve("User 1");
        user.person.displayName = displayName;
        let name = await user.get("name");
        assert.equal(name, "User 1", "User name matches");
    });
});
