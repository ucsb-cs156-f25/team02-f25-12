package edu.ucsb.cs156.example.web;

import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

import edu.ucsb.cs156.example.WebTestCase;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@ActiveProfiles("integration")
@DirtiesContext(classMode = ClassMode.BEFORE_EACH_TEST_METHOD)
public class HelpRequestWebIT extends WebTestCase {
  @Test
  public void admin_user_can_create_edit_delete_helprequest() throws Exception {
    setupUser(true);

    page.getByText("HelpRequests").click();

    page.getByText("Create HelpRequest").click();
    assertThat(page.getByText("Create New HelpRequest")).isVisible();
    page.getByTestId("HelpRequestForm-requesterEmail").fill("hauke@gmal.com");
    page.getByTestId("HelpRequestForm-requestTime").fill("2025-01-01T10:00:00");
    page.getByTestId("HelpRequestForm-teamId").fill("Team4");
    page.getByTestId("HelpRequestForm-tableOrBreakoutRoom").fill("table");
    page.getByTestId("HelpRequestForm-explanation").fill("help");
    page.getByTestId("HelpRequestForm-solved").check();

    page.getByTestId("HelpRequestForm-submit").click();

    assertThat(page.getByTestId("HelpRequestTable-cell-row-0-col-requesterEmail"))
        .hasText("hauke@gmal.com");

    page.getByTestId("HelpRequestTable-cell-row-0-col-Edit-button").click();
    assertThat(page.getByText("Edit HelpRequest")).isVisible();
    page.getByTestId("HelpRequestForm-requesterEmail").fill("hauke@gmail.com");
    page.getByTestId("HelpRequestForm-submit").click();

    assertThat(page.getByTestId("HelpRequestTable-cell-row-0-col-requesterEmail"))
        .hasText("hauke@gmail.com");

    page.getByTestId("HelpRequestTable-cell-row-0-col-Delete-button").click();

    assertThat(page.getByTestId("HelpRequestTable-cell-row-0-col-name")).not().isVisible();
  }

  @Test
  public void regular_user_cannot_create_helprequest() throws Exception {
    setupUser(false);

    page.getByText("HelpRequests").click();

    assertThat(page.getByText("Create HelpRequest")).not().isVisible();
    assertThat(page.getByTestId("HelpRequestTable-cell-row-0-col-name")).not().isVisible();
  }
}
