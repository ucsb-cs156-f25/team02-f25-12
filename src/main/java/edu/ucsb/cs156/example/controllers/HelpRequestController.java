package edu.ucsb.cs156.example.controllers;

import com.fasterxml.jackson.core.JsonProcessingException;
import edu.ucsb.cs156.example.entities.HelpRequest;
import edu.ucsb.cs156.example.errors.EntityNotFoundException;
import edu.ucsb.cs156.example.repositories.HelpRequestRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.time.LocalDateTime;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/** This is a REST controller for HelpRequest */
@Tag(name = "HelpRequests")
@RequestMapping("/api/helprequests")
@RestController
@Slf4j
public class HelpRequestController extends ApiController {

  @Autowired HelpRequestRepository helpRequestRepository;

  /**
   * List all HelpRequests
   *
   * @return an iterable of HelpRequest
   */
  @Operation(summary = "List all ucsb help requests")
  @PreAuthorize("hasRole('ROLE_USER')")
  @GetMapping("/all")
  public Iterable<HelpRequest> allHelpRequests() {
    Iterable<HelpRequest> helprequests = helpRequestRepository.findAll();
    return helprequests;
  }

  /**
   * Get a single helprequest by id
   *
   * @param id the id of the date
   * @return a UCSBDate
   */
  @Operation(summary = "Get a single helprequest")
  @PreAuthorize("hasRole('ROLE_USER')")
  @GetMapping("")
  public HelpRequest getById(@Parameter(name = "id") @RequestParam Long id) {
    HelpRequest helpRequest =
        helpRequestRepository
            .findById(id)
            .orElseThrow(() -> new EntityNotFoundException(HelpRequest.class, id));

    return helpRequest;
  }

  /**
   * Create a new helprequest
   *
   * @param requesterEmail
   * @param teamId
   * @param tableOrBreakoutRoom
   * @param requestTime
   * @param explanation
   * @param solved
   * @return the newly created HelpRequest
   */
  @Operation(summary = "Create a new helprequest")
  @PreAuthorize("hasRole('ROLE_ADMIN')")
  @PostMapping("/post")
  public HelpRequest postHelpRequests(
      @Parameter(name = "requesterEmail") @RequestParam String requesterEmail,
      @Parameter(name = "teamId") @RequestParam String teamId,
      @Parameter(name = "tableOrBreakoutRoom") @RequestParam String tableOrBreakoutRoom,
      @Parameter(name = "explanation") @RequestParam String explanation,
      @Parameter(name = "solved") @RequestParam boolean solved,
      @Parameter(
              name = "requestTime",
              description =
                  "date (in iso format, e.g. YYYY-mm-ddTHH:MM:SS; see https://en.wikipedia.org/wiki/ISO_8601)")
          @RequestParam("requestTime")
          @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
          LocalDateTime requestTime)
      throws JsonProcessingException {

    // For an explanation of @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    // See: https://www.baeldung.com/spring-date-parameters

    log.info("requestTime={}", requestTime);

    HelpRequest helpRequest = new HelpRequest();
    helpRequest.setRequesterEmail(requesterEmail);
    helpRequest.setTeamId(teamId);
    helpRequest.setTableOrBreakoutRoom(tableOrBreakoutRoom);
    helpRequest.setRequestTime(requestTime);
    helpRequest.setExplanation(explanation);
    helpRequest.setSolved(solved);
    HelpRequest savedHelpRequest = helpRequestRepository.save(helpRequest);

    return savedHelpRequest;
  }

  /**
   * Update a single helprequest
   *
   * @param id id of the helprequest to update
   * @param incoming the new helprequest data
   * @return the updated helprequest object
   */
  @Operation(summary = "Update a single helprequest")
  @PreAuthorize("hasRole('ROLE_ADMIN')")
  @PutMapping
  public HelpRequest updateHelpRequest(
      @Parameter(name = "id") @RequestParam Long id, @RequestBody @Valid HelpRequest incoming) {

    if (helpRequestRepository.findById(id).isEmpty()) {
      throw new EntityNotFoundException(HelpRequest.class, id);
    }

    helpRequestRepository.save(incoming);
    return incoming;
  }

  /**
   * Delete a HelpRequest
   *
   * @param id the id of the helpRequest to delete
   * @return a message indicating the helpRequest was deleted
   */
  @Operation(summary = "Delete a helpRequest")
  @PreAuthorize("hasRole('ROLE_ADMIN')")
  @DeleteMapping("")
  public Object deleteHelpRequest(@Parameter(name = "id") @RequestParam Long id) {
    HelpRequest helpRequest =
        helpRequestRepository
            .findById(id)
            .orElseThrow(() -> new EntityNotFoundException(HelpRequest.class, id));

    helpRequestRepository.delete(helpRequest);
    return genericMessage("HelpRequest with id %s deleted".formatted(id));
  }
}
