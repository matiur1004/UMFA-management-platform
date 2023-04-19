using ClientPortal.Interfaces;
using ClientPortal.Models.MessagingModels;

namespace ClientPortal.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class MessagingController : ControllerBase
    {
        private readonly IMailService _email;

        public MessagingController(IMailService mail)
        {
            _email = mail;
        }

        [HttpPost("sendEmail")]
        public async Task<IActionResult> SendMailAsync(MailData mailData)
        {
            bool result = await _email.SendAsync(mailData, new CancellationToken());

            if (result)
            {
                return StatusCode(StatusCodes.Status200OK, "Mail has successfully been sent.");
            }
            else
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred. The Mail could not be sent.");
            }
        }

        [HttpPost("sendWhatsApp")]
        public async Task<IActionResult> SendWhatsAppAsync(MailData mailData)
        {
            bool result = await _email.SendAsync(mailData, new CancellationToken());

            if (result)
            {
                return StatusCode(StatusCodes.Status200OK, "Mail has successfully been sent.");
            }
            else
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred. The Mail could not be sent.");
            }
        }

        [HttpPost("sendTelegram")]
        public async Task<IActionResult> SendTelegramAsync(MailData mailData)
        {
            bool result = await _email.SendAsync(mailData, new CancellationToken());

            if (result)
            {
                return StatusCode(StatusCodes.Status200OK, "Mail has successfully been sent.");
            }
            else
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred. The Mail could not be sent.");
            }
        }
    }
}



