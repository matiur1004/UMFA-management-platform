using ClientPortal.Controllers.Authorization;
using ClientPortal.Interfaces;
using ClientPortal.Models.MessagingModels;

namespace ClientPortal.Controllers
{
    [Authorize]
    [Route("[controller]")]
    [ApiController]
    public class MessagingController : ControllerBase
    {
        private readonly IMailService _email;
        private readonly IWhatsAppService _whis;
        private readonly ITelegramService _gram;

        public MessagingController(IMailService mail, IWhatsAppService whis, ITelegramService gram)
        {
            _email = mail;
            _whis = whis;
            _gram = gram;
        }

        [HttpPost("sendEmail")]
        public async Task<IActionResult> SendMailAsync(MailData mailData)
        {
            bool result = await _email.SendAsync(mailData, new CancellationToken());

            if (result)
            {
                return StatusCode(StatusCodes.Status200OK, "Message has successfully been sent.");
            }
            else
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred. The message could not be sent.");
            }
        }

        [HttpPost("sendWhatsApp")]
        public async Task<IActionResult> SendWhatsAppAsync(WhatsAppData wData)
        {
            bool result = await _whis.SendPortalAlarmAsync(wData, new CancellationToken());

            if (result)
            {
                return StatusCode(StatusCodes.Status200OK, "Message has successfully been sent.");
            }
            else
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred. The message could not be sent.");
            }
        }

        [HttpPost("sendTelegram")]
        public async Task<IActionResult> SendTelegramAsync(TelegramData tData)
        {
            bool result = await _gram.SendAsync(tData, new CancellationToken());

            if (result)
            {
                return StatusCode(StatusCodes.Status200OK, "Message has successfully been sent.");
            }
            else
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred. The message could not be sent.");
            }
        }
    }
}



