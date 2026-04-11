using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChatApp.Domain.Entities
{
    public class Message
    {
        public int Id { get; set; }
        public string User { get; set; }
        public string Text { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
