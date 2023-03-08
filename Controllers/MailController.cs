using ClientPortal.Controllers.Authorization;
using ClientPortal.Interfaces;
using ClientPortal.Models.MailModels;
using Microsoft.AspNetCore.Mvc;

namespace ClientPortal.Controllers
{
    [Authorize]
    [Route("[controller]")]
    [ApiController]
    public class MailController : ControllerBase
    {
        private readonly IMailService _mail;

        public MailController(IMailService mail)
        {
            _mail = mail;
        }

        [HttpPost("sendMail")]
        public async Task<IActionResult> SendMailAsync(MailData mailData)
        {
            bool result = await _mail.SendAsync(mailData, new CancellationToken());

            if (result)
            {
                return StatusCode(StatusCodes.Status200OK, "Mail has successfully been sent.");
            }
            else
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred. The Mail could not be sent.");
            }
        }

        [HttpPost("sendMailWithAttachment")]
        public async Task<IActionResult> SendMailWithAttachmentAsync([FromForm] MailDataWithAttachments mailData)
        {
            bool result = await _mail.SendWithAttachmentsAsync(mailData, new CancellationToken());

            if (result)
            {
                return StatusCode(StatusCodes.Status200OK, "Mail with attachment has successfully been sent.");
            }
            else
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred. The Mail with attachment could not be sent.");
            }
        }
    }
}