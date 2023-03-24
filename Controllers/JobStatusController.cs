using ClientPortal.Controllers.Authorization;
using ClientPortal.Data;
using ClientPortal.Data.Entities.PortalEntities;

namespace ClientPortal.Controllers
{
    [Authorize]
    [Route("[controller]")]
    [ApiController]
    public class JobStatusController : ControllerBase
    {
        private readonly PortalDBContext _context;

        public JobStatusController(PortalDBContext context)
        {
            _context = context;
        }

        // GET: JobStatus
        [HttpGet("getAll")]
        public async Task<ActionResult<IEnumerable<JobStatus>>> GetJobStatus()
        {
          if (_context.JobStatus == null)
          {
              return NotFound();
          }
            return await _context.JobStatus.ToListAsync();
        }

        // GET: JobStatus/5
        [HttpGet("getJobStatus/{id}")]
        public async Task<ActionResult<JobStatus>> GetJobStatus(int id)
        {
          if (_context.JobStatus == null)
          {
              return NotFound();
          }
            var jobStatus = await _context.JobStatus.FindAsync(id);

            if (jobStatus == null)
            {
                return NotFound();
            }

            return jobStatus;
        }

        //// PUT: JobStatus/5
        //// To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        //[HttpPut("{id}")]
        //public async Task<IActionResult> PutJobStatus(int id, JobStatus jobStatus)
        //{
        //    if (id != jobStatus.Id)
        //    {
        //        return BadRequest();
        //    }

        //    _context.Entry(jobStatus).State = EntityState.Modified;

        //    try
        //    {
        //        await _context.SaveChangesAsync();
        //    }
        //    catch (DbUpdateConcurrencyException)
        //    {
        //        if (!JobStatusExists(id))
        //        {
        //            return NotFound();
        //        }
        //        else
        //        {
        //            throw;
        //        }
        //    }

        //    return NoContent();
        //}

        //// POST: JobStatus
        //// To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        //[HttpPost]
        //public async Task<ActionResult<JobStatus>> PostJobStatus(JobStatus jobStatus)
        //{
        //  if (_context.JobStatus == null)
        //  {
        //      return Problem("Entity set 'PortalDBContext.JobStatus'  is null.");
        //  }
        //    _context.JobStatus.Add(jobStatus);
        //    await _context.SaveChangesAsync();

        //    return CreatedAtAction("GetJobStatus", new { id = jobStatus.Id }, jobStatus);
        //}

        //// DELETE: JobStatus/5
        //[HttpDelete("{id}")]
        //public async Task<IActionResult> DeleteJobStatus(int id)
        //{
        //    if (_context.JobStatus == null)
        //    {
        //        return NotFound();
        //    }
        //    var jobStatus = await _context.JobStatus.FindAsync(id);
        //    if (jobStatus == null)
        //    {
        //        return NotFound();
        //    }

        //    _context.JobStatus.Remove(jobStatus);
        //    await _context.SaveChangesAsync();

        //    return NoContent();
        //}

        //private bool JobStatusExists(int id)
        //{
        //    return (_context.JobStatus?.Any(e => e.Id == id)).GetValueOrDefault();
        //}
    }
}
